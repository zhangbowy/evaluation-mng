/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { user?: User | undefined }) {
  const { user } = initialState || {};
  return {
    canAdmin: user
  };
}
