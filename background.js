const DELETE_DAYS_AGO = 2;  // n日以上前の履歴を削除
const DELETE_HOURS_AGO = 0;  // n時間以上前の履歴を削除
const DELETE_MINUTES_AGO = 0;  // n分以上前の履歴を削除
const DELETE_SECONDS_AGO = 0;  // n秒以上前の履歴を削除

// 拡張機能がインストールされた時、または更新された時に実行
chrome.runtime.onInstalled.addListener(() => {
    console.log('Auto History Cleaner拡張機能がインストールされました');
    clearHistoryData();
});

// Chrome起動時に実行
chrome.runtime.onStartup.addListener(() => {
    console.log('Chrome起動時に履歴を削除中...');
    clearHistoryData();
});

// 履歴データを削除する関数
function clearHistoryData() {
    const endTime = Date.now() - (((((DELETE_DAYS_AGO * 24) + DELETE_HOURS_AGO) * 60) + DELETE_MINUTES_AGO) * 60 + DELETE_SECONDS_AGO) * 1000;
    const startTime = 0; // 1970年1月1日

    console.log(`${DELETE_DAYS_AGO}日前以前の履歴を削除します`);

    chrome.history.deleteRange({
        startTime: startTime,
        endTime: endTime
    });
    console.log('履歴削除が完了しました');

    chrome.browsingData.remove({
        since: startTime
    }, {
        downloads: true
    });
    console.log('ダウンロード履歴削除が完了しました');
}