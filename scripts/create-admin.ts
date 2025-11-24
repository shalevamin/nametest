import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    const email = 'admin@pitchon-lev.co.il'
    const password = 'adminPassword123!'
    const fullName = 'Admin User'
    
    console.log(`Creating admin user: ${email}`)

    // Using the updated logic where we pass role in metadata
    // IMPORTANT: This relies on the handle_new_user trigger being updated first!
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'admin'
            }
        }
    })

    if (error) {
        console.error("Error creating user:", error.message)
    } else {
        console.log("User created successfully:", data.user?.id)
        console.log("NOTE: If the trigger was NOT updated, this user is still a candidate.")
        console.log("Please check the profiles table.")
    }
}

main()

