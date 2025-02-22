---
html: ledger-structure.html
parent: ledgers.html
seo:
    description: 個別のレジャーブロックの要素を詳しく見てみましょう。
---
# レジャーの構成要素

XRP Ledgerはブロックチェーンであり、データブロックの履歴を順番に並べたものです。XRP Ledgerブロックチェーンのブロックは、 _レジャーバージョン_ または略して _レジャー_ と呼ばれます。

コンセンサスプロトコルは、以前のレジャーバージョンを起点として、次に適用するトランザクションのセットについてバリデータ間の合意を形成し、それらのトランザクションを適用することで全員が同じ結果を得たことを確認します。これが成功すると、結果として新しいレジャーバージョンが作成されます。そこから、次のレジャーバージョンを構築するプロセスが繰り返されます。

各レジャーバージョンには、 _状態データ_ 、 _トランザクションセット_ 、メタデータを含む _ヘッダー_ が含まれます。

[{% inline-svg file="/docs/img/ledger.svg" /%}](/docs/img/ledger.svg "図: レジャーはヘッダー、トランザクションセット、状態データから構成されます。")


## 状態データ

[{% inline-svg file="/docs/img/ledger-state-data.svg" /%}](/docs/img/ledger-state-data.svg "図: レジャーの状態データは、さまざまなオブジェクトで構成され、グラフのようにリンクされていることもあります。")

_状態データ_ とは、そのレジャーバージョンにおけるすべてのアカウント、残高、設定、その他の情報のスナップショットを表します。サーバがネットワークに接続すると、最初に行うことの1つは、新しいトランザクションを処理し、現在の状態に関するクエリに答えることができるように、現在の状態データの完全なセットをダウンロードすることです。ネットワーク内のすべてのサーバが状態データの完全なコピーを持っているため、すべてのデータは公開され、どのコピーも同じように有効です。

状態データは _レジャーエントリ_ と呼ばれる個別のオブジェクトで構成され、ツリー形式で保存されます。各レジャーエントリには一意の256ビットのIDがあり、それを使用して状態ツリーから検索することができます。

## トランザクションセット

[{% inline-svg file="/docs/img/ledger-transaction-set.svg" /%}](/docs/img/ledger-transaction-set.svg "図: レジャーのトランザクションセット、正規の順序で並べられたトランザクションのグループ")

レジャーに加えられたすべての変更は、トランザクションの結果です。各レジャーバージョンには、特定の順序で新たに適用されたトランザクションのグループである _トランザクションセット_ が含まれています。あるレジャーのトランザクションセットを前のレジャーバージョンの状態データに適用すると、結果としてそのレジャーの状態データが得られます。

レジャーのトランザクションセット内のすべてのトランザクションは、以下の両方の要素を持ちます。

- 送信者がレジャーに何を指示したかを示す _トランザクションの内容_ 。
- トランザクションがどのように処理され、レジャーの状態データにどのような影響を与えたかを正確に示す _トランザクションのメタデータ_ 。


## レジャーヘッダー

_レジャーヘッダー_ は、レジャーバージョンの概略を示すデータのブロックです。レポートの表紙のように、レジャーバージョンを一意に識別し、その内容を記載し、他の注意事項とともに作成時刻を表しています。レジャーヘッダーには以下の情報が含まれます。

<!-- Note: the alt text for the diagrams is intentionally empty because any caption would be redundant with the text. -->

- [{% inline-svg file="/docs/img/ledger-index-icon.svg" /%}](/docs/img/ledger-index-icon.svg "") チェーン内でのレジャーの位置を示す _レジャーインデックス_ 。レジャーは、1つ小さいインデックスを持つレジャーの上に構築され、 _ジェネシスレジャー_ として知られるスタート地点に戻ります。これは、すべてのトランザクションと結果の公開履歴を形成します。
- [{% inline-svg file="/docs/img/ledger-hash-icon.svg" /%}](/docs/img/ledger-hash-icon.svg "") レジャーの内容を一意に識別する _レジャーハッシュ_ 。ハッシュは、レジャーバージョンの内容が変更された場合、ハッシュが完全に異なるものになるように計算されます。これは、レジャーのデータが消失、変更、破損していないことを示すチェックサムのようなものでもあります。
- [{% inline-svg file="/docs/img/ledger-parent-icon.svg" /%}](/docs/img/ledger-parent-icon.svg "") 親レジャーのハッシュ。レジャーバージョンは、その前の _親レジャー_ との違いによって定義されることが多く、ヘッダーには親レジャーの一意なハッシュも含まれます。
- [{% inline-svg file="/docs/img/ledger-timestamp-icon.svg" /%}](/docs/img/ledger-timestamp-icon.svg "") このレジャーの内容が確定した正式なタイムスタンプとなる _閉鎖時刻_ 。この数値は秒数(一の位)が四捨五入され、通常は10です。
- [{% inline-svg file="/docs/img/ledger-state-data-hash-icon.svg" /%}](/docs/img/ledger-state-data-hash-icon.svg "") このレジャーの状態データのチェックサムとして機能する _状態データのハッシュ_ 。
- [{% inline-svg file="/docs/img/ledger-tx-set-hash-icon.svg" /%}](/docs/img/ledger-tx-set-hash-icon.svg "") このレジャーのトランザクションセットのデータのチェックサムとして機能する _トランザクションセットのハッシュ_。
- [{% inline-svg file="/docs/img/ledger-notes-icon.svg" /%}](/docs/img/ledger-notes-icon.svg "") その他、存在するXRPの総量や、閉鎖時刻が四捨五入された値など、いくつかのメモがあります。

レジャーのトランザクションセットと状態データのサイズは無制限ですが、レジャーヘッダーは常に固定サイズです。レジャーヘッダーの正確なデータとバイナリ形式については、[レジャーヘッダー](../../references/protocol/ledger-data/ledger-header.md)を参照してください。


## バリデーションの状況

[{% inline-svg file="/docs/img/ledger-validated-mark.svg" /%}](/docs/img/ledger-validated-mark.svg "Diagram: レジャーのバリデーション(検証)状況。レジャーの上に追加され、レジャー自体の一部ではありません。")

サーバの Unique Node List のバリデータのコンセンサスがレジャーバージョンの内容に合意すると、そのレジャーバージョンは検証済みであり、変更不可であるとみなされます。レジャーの内容は、後続のトランザクションが新しいレジャーバージョンを作成し、チェーンを更新することによってのみ変更できます。

レジャーバージョンが新しく作成された時点では、まだ未検証です。候補となるトランザクションが異なるサーバに到着するタイミングが異なるため、ネットワークはチェーンの次のステップとなる複数の異なるレジャーバージョンを構築し、提案する可能性があります。[コンセンサスプロトコル](../consensus-protocol/index.md)は、そのうちのどれを有効化するかを決定します。(検証済みのレジャーバージョンに存在しなかったトランザクション候補は、通常、次のレジャーバージョンのトランザクションセットに含まれます)。


## レジャーインデックスとレジャーハッシュ
レジャーバージョンを識別する方法には、 _レジャーインデックス_ と _レジャーハッシュ_ の2種類があります。この2つのフィールドはどちらもレジャーを識別しますが、その目的は異なります。レジャーインデックスはチェーン内でのレジャーの位置を表し、レジャーハッシュはレジャーの内容を表します。

異なるチェーンのレジャーは、レジャーインデックスは同じでもハッシュが異なることがあります。また、検証されていないレジャーバージョンを扱う場合、インデックスが同じでも内容が異なるため、ハッシュが異なる複数のレジャー候補が存在する可能性があります。

同じレジャーハッシュを持つ2つのレジャーは、常に完全に同一です。
