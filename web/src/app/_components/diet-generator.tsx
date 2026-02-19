"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DietData } from "@/types/diet-data.type";
import { Loader, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { start } from "repl";
import { set } from "zod";
import ReactMarkdown from "react-markdown";

export function DietGenerator({ data }: { data: DietData }) {
    const [output, setOutput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    const controllerRef = useRef<AbortController | null>(null);

    async function startStreaming() {

        const controller = new AbortController();
        controllerRef.current = controller;

        setOutput("");
        setIsStreaming(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/plan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: data.nome,
                    idade: data.idade,
                    altura_cm: data.altura_cm,
                    peso_kg: data.peso_kg,
                    sexo: data.sexo,
                    nivel_atividade: data.nivel_atividade,
                    objetivo: data.objetivo,
                }),
                //       \/ PERMITE CANCELAR A QUALQUER MOMENTO 
                signal: controller.signal,
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { value, done } = await reader!.read();
                if (done) break;
                
                setOutput((prev) => prev + decoder.decode(value));
            }
        }catch (err: any) {
            if (err.name === "AbortError") {
                console.log("Streaming cancelado pelo usuário.");
                return;
            }

            console.log(err);
        }finally {
            setIsStreaming(false);
            controllerRef.current = null;
        }
        
    }
    

    async function handleGenerate() {
        if (isStreaming) {
            controllerRef.current?.abort();
            setIsStreaming(false);
            return;
        }

        await startStreaming();
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-4xl border-0 p-4 md:p-6  shadow-black shadow-2xl bg-zinc-900">

                <div className="flex justify-center gap-4">
                    <Button className="cursor-pointer gap-2 bg-green-600 hover:bg-green-700" size="lg" onClick={handleGenerate} >
                        {isStreaming ? <Loader className="w-6 h-6 animate-spin"/> : <Sparkles className="w-6 h-6"/>}
                        {isStreaming ? "Parar Geração" : "Gerar Dieta"}
                    </Button>
                </div>


                {output && (
                    <div className="bg-card rounded-lg p-6 border border-border max-h-[500px] overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                            components={{
                                h2: ({node, ...props}) => (
                                    <h2 
                                        className="text-xl font-bold text-green-600 my-1"
                                        {...props} 
                                    />
                                ), 
                                h1: ({node, ...props}) => (
                                    <h1 
                                        className="text-2xl font-bold text-zinc-900 mb-1"
                                        {...props} 
                                    />
                                )

                            }}
                            >
                                {output}
                            </ReactMarkdown>
                        </div>

                    </div>
                )}
            </Card>
        </div>
    )
}