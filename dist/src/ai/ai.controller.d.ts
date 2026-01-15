import { AiService, AnalysisResult } from './ai.service';
export declare class AiController {
    private aiService;
    constructor(aiService: AiService);
    analyzeInscription(userId: string): Promise<AnalysisResult>;
}
