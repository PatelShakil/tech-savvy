export interface ProjectData {
    projectRepo: string;
    projectName: string;
    projectDescription: string;
    phone: string;
    projectType: string;
    platform: string[];
    designPreferences: string;
    coreFeatures: string;
    additionalFeatures: string;
    budget: string;
    deadline: string;
    comments: string;
    isApproved: boolean;
    uid: string | undefined;
}
