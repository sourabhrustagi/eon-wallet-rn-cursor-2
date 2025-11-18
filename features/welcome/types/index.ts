export interface Slide {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface SlidesResponse {
  success: boolean;
  data?: Slide[];
  message?: string;
}

