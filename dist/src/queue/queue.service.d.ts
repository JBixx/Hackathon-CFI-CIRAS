import { EmailService } from '../email/email.service';
export declare class QueueService {
    private emailService;
    private readonly logger;
    constructor(emailService: EmailService);
    addEmailJob(type: string, data: any): Promise<any>;
    private sendDirectEmail;
}
