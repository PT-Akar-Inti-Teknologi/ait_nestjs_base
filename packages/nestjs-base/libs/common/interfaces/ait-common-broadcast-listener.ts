export type AitCommonBroadcastListener = (
  entityId: string,
  data: Record<string, any>,
) => Promise<any>;
