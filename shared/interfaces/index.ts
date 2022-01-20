import { NextPage } from "next";
import { ParsedUrlQuery } from "querystring";

export interface Layout {
  children: NextPage;
}

export interface Card {
  className?: string;
  data: CategoryItem;
  href: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface Page {
  title: string;
  slug: string;
}

export interface CategoryItem {
  title: string;
  subtitle: string;
  content: string;
  parentId: number;
  slug: string;
  fileImage: FileImage;
  color: string;
  typeId: number;
  page: Page | null;
  parentSlug: string;
}
export interface PageItem {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  parentId: number;
  slug: string;
  fileImage: FileImage;
  fileWideImage: FileImage;
  color: string;
  typeId: number;
  page: string | null;
  parentSlug: string;
}
export interface FileImage {
  name: string | null;
}

export interface Slug extends ParsedUrlQuery {
  slug: string;
}

export interface SubSlug extends ParsedUrlQuery {
  sub_slug: string;
}

export interface Parameter {
  description: string;
  id?: number;
  name: string;
  slug?: string;
}

export interface SubParameter {
  description: string;
  id: number;
  name: string;
  slug: string;
  parameter: Parameter;
  parameterId: number;
}

export interface Rule {
  id: number;
  orderOf: number;
  parameterDescription: string;
  parameterId: number;
  parameterName: string;
  parameterSlug: string;
  subParameterDescription1: string;
  subParameterDescription2: string;
  subParameterId1: number;
  subParameterId2: number;
  subParameterName1: string;
  subParameterName2: string;
  subParameterSlug1: string;
  subParameterSlug2: string;
  value: string;
}
