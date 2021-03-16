export default function(initialState) {
  const { permission, account } = initialState;
  return {
    'is:super': account ?.is_super ?? false,
    'is:staff': (account ?.level ?? 2) === 2,
    ...permission
  };
}