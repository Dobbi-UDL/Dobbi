import { supabase } from '../config/supabase'; // Asegúrate de tener configurado supabase

export const authService = {
  // Registro de usuario
  async signUp({ username, email, password, phone }) {
    try {
      // 1. Crear usuario en auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Crear entrada en la tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id, // Usar el mismo UID de auth.users
            username,
            email,
            points: 0,
            created_at: new Date(),
          },
        ])
        .select()
        .single();

      if (userError) {
        // Si hay error al crear el usuario en la tabla users, eliminar el auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw userError;
      }

      return {
        user: userData,
        session: authData.session,
      };
    } catch (error) {
      throw error;
    }
  },

  // Inicio de sesión
  async signIn({ email, password }) {
    try {
      // 1. Autenticar usuario
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Obtener datos del usuario de la tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      return {
        user: userData,
        session: authData.session,
      };
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },

  // Obtener sesión actual
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const session = await this.getCurrentSession();
      if (!session) return null;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) throw userError;

      return userData;
    } catch (error) {
      throw error;
    }
  }
};