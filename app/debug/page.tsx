"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DebugPage() {
    const [status, setStatus] = useState("Initializing...");
    const [envCheck, setEnvCheck] = useState<any>({});

    useEffect(() => {
        try {
            const supabase = createClient();
            console.log("Supabase client created:", supabase);

            setStatus("Supabase Client initialized successfully.");
            setEnvCheck({
                url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Present" : "Missing",
                key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing"
            });

        } catch (e: any) {
            console.error("Debug Error:", e);
            setStatus("Error: " + e.message);
        }
    }, []);

    return (
        <div className="p-10 bg-black text-green-500 font-mono">
            <h1>Debug Interface</h1>
            <p>Status: {status}</p>
            <pre>{JSON.stringify(envCheck, null, 2)}</pre>
        </div>
    );
}
