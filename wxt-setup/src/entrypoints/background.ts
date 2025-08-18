// export default defineBackground(() => {
//   console.log('Hello background!', { id: browser.runtime.id });
// });

export default defineBackground(() => {
  // optional: listen for install/update
  browser.runtime.onInstalled.addListener(() => {});
});