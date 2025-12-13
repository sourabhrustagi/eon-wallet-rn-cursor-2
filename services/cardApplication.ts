import apiClient from './api';

export interface CardApplicationRequest {
  cardUsage: string[];
  purposes: string[];
  otherPurpose?: string;
}

export interface CardApplicationResponse {
  success: boolean;
  message: string;
  data: {
    applicationId: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    estimatedProcessingTime: string;
  };
}

export const submitCardApplication = async (
  data: CardApplicationRequest
): Promise<CardApplicationResponse> => {
  const response = await apiClient.post<CardApplicationResponse>(
    '/api/card-application',
    data
  );
  return response.data;
};

