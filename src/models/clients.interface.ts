export interface IClients {
    GeneralDetails: {
        ClientID: number;
        ClientName: string;
        ClientLastName?: string;
        ClientSSN?: string;
        ClientAddress?: string;
        ClientCity?: string;
        ClientState?: string;
        ClientZip?: string;
        ClientPhone?: string;
        ClientEmail?: string;
        ClientDoB?: string;
        ClientSecondaryPhone?: string;
        ClientSecondaryEmail?: string;
        IsDischarged?: boolean;
        DischargeReason?: string;
        DischargeDate?: Date;
        DischargeNote?: string;
    },
    InsuranceDetails?: {
        InsuranceCompany: {
            InsuranceCompanyID: number;
            InsuranceCompanyName?: string;
            InsurancePhone?: string;
        },
        InsuranceMemberID?: string;
        PolicyHolderName?: string;
        InsuranceCompanyPhone?: string;
        PolicyDoB?: string;
        IsSameAsClient?: boolean;
    },
    ClientSessionDetails?: {
        ClientSessionID: number;
        ClientSessionDate: string;
        ClientSessionNotes: string;
        ClientSessionICDCodes?: [
            {
                CPTCodeID: number;
                CPTCodeName: string;
                CPTCodeDescr?: string;
            }
        ];
        ClientSessionCPTCodes?: [
            {
                ICDCodeID: number;
                ICDCodeName: string;
                ICDCodeDescr?: string;
            }
        ];
    }
}