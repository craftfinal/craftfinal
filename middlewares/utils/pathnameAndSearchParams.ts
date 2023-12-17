// @/actions/pathnameAndSearchParamsActions.ts

export const pathnameAndSearchParamsHeaderName = {
  pathname: "x-pathname",
  searchParams: "x-searchparams",
};

export interface PathnameAndSearchParamsType {
  pathname: string | null;
  searchParams: string | null;
}
