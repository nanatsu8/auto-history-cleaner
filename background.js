// Chrome拡張機能のサービスワーカー
// Chrome起動時に自動で履歴とダウンロード履歴を削除する

const DELETE_DAYS_AGO = 1;  // n日以上前の履歴を削除
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
    // 削除対象期間の計算
    // const endTime = Date.now() - DELETE_DAYS_AGO * 24 * 60 * 60 * 1000;
    // const endTime = Date.now() - DELETE_DAYS_AGO * 60 * 1000;
    const endTime = Date.now() - (((((DELETE_DAYS_AGO * 24) + DELETE_HOURS_AGO) * 60) + DELETE_MINUTES_AGO) * 60 + DELETE_SECONDS_AGO) * 1000;
    const startTime = 0; // 1970年1月1日

    console.log(`${DELETE_DAYS_AGO}日前（${new Date(endTime).toLocaleString()}）以前の履歴を削除します`);

    // chrome.history APIを使用して履歴を検索・削除
    chrome.history.search({
        text: '',           // 全ての履歴を対象
        startTime: startTime,
        endTime: endTime,
        maxResults: 10000   // 一度に処理する最大件数
    }, (historyItems) => {
        if (chrome.runtime.lastError) {
            console.error('履歴検索中にエラーが発生しました:', chrome.runtime.lastError);
            return;
        }

        console.log(`削除対象の履歴件数: ${historyItems.length}件`);

        // 各履歴項目を個別に削除
        let deletedCount = 0;
        let errorCount = 0;

        if (historyItems.length === 0) {
            console.log('削除対象の履歴はありませんでした');
            return;
        }

        historyItems.forEach((item, index) => {
            chrome.history.deleteUrl({ url: item.url }, () => {
                if (chrome.runtime.lastError) {
                    console.error(`URL削除エラー (${item.url}):`, chrome.runtime.lastError);
                    errorCount++;
                } else {
                    deletedCount++;
                }

                // 全ての削除処理が完了した時のログ出力
                if (index === historyItems.length - 1) {
                    console.log(`履歴削除完了: 成功 ${deletedCount}件, エラー ${errorCount}件`);

                    // ダウンロード履歴も削除（browsingData APIを使用）
                    chrome.browsingData.remove({
                        since: startTime
                    }, {
                        downloads: true
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('ダウンロード履歴削除中にエラーが発生しました:', chrome.runtime.lastError);
                        } else {
                            console.log('ダウンロード履歴削除が正常に完了しました');
                        }
                    });
                }
            });
        });
    });
}