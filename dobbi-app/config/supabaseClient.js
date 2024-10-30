import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iocaslevcrftfqasuwhj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvY2FzbGV2Y3JmdGZxYXN1d2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzMTkwODksImV4cCI6MjA0Mzg5NTA4OX0.O9LPmkdBJotjMBUXk27oKiI6_7nXiMa8DVZ1pf9EgUw';

export const supabase = createClient(supabaseUrl, supabaseKey);
