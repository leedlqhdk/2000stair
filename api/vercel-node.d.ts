declare module "@vercel/node" {
  export type VercelRequest = {
    method?: string;
    query: Record<string, string | string[] | undefined>;
    body?: Record<string, unknown>;
  };

  export type VercelResponse = {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => VercelResponse;
    json: (body: unknown) => void;
  };
}
