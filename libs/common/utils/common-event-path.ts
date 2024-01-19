export const commonEventTopic = (
  entityId: string,
  action: 'update' | 'delete',
) => `common.broadcast.${entityId}.${action}`;

export const topicToEntityName = (event: string) => {
  const splits = event.split('.');
  if (splits.length < 4) return '';
  return splits[splits.length - 2];
};
