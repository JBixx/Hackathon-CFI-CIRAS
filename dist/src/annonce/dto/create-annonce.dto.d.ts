import { AnnonceCible } from '@prisma/client';
export declare class CreateAnnonceDto {
    titre: string;
    contenu: string;
    cible: AnnonceCible;
    hackathonId?: string;
}
