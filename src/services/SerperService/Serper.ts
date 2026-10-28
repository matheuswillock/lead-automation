'use client'
import InputSearchLead from "@/domain/Dto/InputSearchLead";
import OutputSearchLead from "@/domain/Dto/OutputSearchLead";

export interface InputSerper {
  query: string;
  location?: string;
  country: string;
  language: string;
  page: number;
}

export const MAX_SERPER_PAGES = 10;
