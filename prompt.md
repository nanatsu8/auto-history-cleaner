chrome起動時に自動で履歴を削除するchrome拡張機能を作成してください。
削除対象は、閲覧履歴とダウンロード履歴です。
期間は全期間です。
具体的には、以下のコードを使用してください。

```js
chrome.browsingData.remove({
  since: 0
}, {
  history: true,
  downloads: true
}, () => {
  console.log("閲覧履歴とダウンロード履歴を削除しました");
});
```
