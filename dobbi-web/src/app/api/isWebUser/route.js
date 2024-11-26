import { supabase } from "@/lib/supabase";

export async function POST(request) {
  const { email } = await request.json();
  console.log("Attempting to get user with email:", email);

  try {
    // get user from email
    const { data: userData, error: userError } = await supabase
      .from("companies")
      .select("*")
      .eq("email", email);
    console.log("userData:", userData);

    if (userError) throw userError;

    if (userData) {
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("id", userData.id)
        .single();
      if (companyError) throw companyError;

      return new Response(
        JSON.stringify({ user: userData, company: companyData }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
