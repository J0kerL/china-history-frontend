import { get, ApiResponse } from "./api";

export interface EventVO {
  id: number;
  title: string;
  startYear: number | null;
  endYear: number | null;
  dynastyId: number | null;
  category: string | null;
  summary: string | null;
  details: string | null;
}

export const getAllEvents = (): Promise<ApiResponse<EventVO[]>> => {
  return get<EventVO[]>("/events");
};

export const getEventById = (id: number): Promise<ApiResponse<EventVO>> => {
  return get<EventVO>(`/events/${id}`);
};
