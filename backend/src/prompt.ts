import type { DietPlanRequest } from "./types.js";

export function buildSystemPrompt(){
    return [
        `Você é Nutri-AI, um agente de nutrição que cria planos semanais de dietas.
        Regras fixas:
        - Sempre responda em texto markdown legível para humanos.
        - Use # para títulos e - para itens de lista.
        - A dieta deve conter exatamente 7 dias.
        - Cada dia deve ter 4 refeições fixas: café_da_manhã, almoço, lanche, jantar.
        - SEMPRE inclua ingredientes comuns no Brasil.
        - NUNCA inclua calorias e macros de cada refeição, apenas as refeições.
        - Evite alimentos ultraprocessados.
        - Não responda em JSON ou outro formato, apenas texto markdown legível para humanos.
        - Não inclua dicas como: bom consultar um nutricionista para um acompanhamento mais personalizado ou: lembre-se de beber água, ou qualquer outra dica, apenas a dieta semanal.`
    ].join('\n');
}

export function buildUserPrompt(input: DietPlanRequest){
    return [
        "Com base nas seguintes informações, crie um plano semanal de dieta para o usuário:",
        `- Nome: ${input.nome}`,
        `- Idade: ${input.idade} anos`,
        `- Altura em cm: ${input.altura_cm}`,
        `- Peso em kg: ${input.peso_kg}`,
        `- Sexo: ${input.sexo}`,
        `- Nível de Atividade: ${input.nivel_atividade}`,
        `- Objetivo: ${input.objetivo}`,
    ].join('\n');
}

export function buildDocsSystemPrompt(doc: string){
    return `Documento técnico para consulta do agente: ${doc}`;
}