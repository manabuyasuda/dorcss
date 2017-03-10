# DORCSS(division of roles CSS)

DORCSS（ドールシーエスエス）はRole（役割）を分担・分割（Division）することで影響範囲を管理するCSS設計の構成案です。

[OOCSS](https://github.com/stubbornella/oocss)、[SMACSS](https://smacss.com/ja)、[BEM](https://en.bem.info/)、[FLOCSS](https://github.com/hiloki/flocss)、[Atomic Desing](http://atomicdesign.bradfrost.com/)、[Enduring CSS](http://ecss.io/)、[large-scale-javascript](https://github.com/azu/large-scale-javascript)に強く影響を受けています。

DORCSSでは以下のような用語を使います。

- コンポーネント - 役割をもった部品
- モジュール - コンポーネントをファイル化したもの
- レイヤー - モジュールをカテゴライズした状態
- 装飾 - `color`や`background-color`のような見た目に関すること
- 構造 - `display`や`padding`のような骨格に関すること
- 配置 - `margin`や`position`などのレイアウトに関すること
- コンテキスト - そのデザインにした理由や、そのコンポーネントを使う状況
- 名前空間 - コンポーネントの役割やコンテキストを示す接頭辞

## DORCSSの基本

### 継承を利用する
コンポーネントはハードコード（ある状態でだけ正しくふるまうこと）をできるだけ避けるべきです。規模の大きなWebサイトでは1つのデザイン変更で多くのコンポーネントに修正が必要になってしまう恐れがあるからです。

CSSには継承という仕組みがあります。ルート要素にベースとなるスタイルを指定して、それをコンポーネントが継承して利用できるようにします。変数や@apply ruleを併用して一括で管理できるのが理想的です。また、サイズの単位はpxをなるべく避け、remやemをベースにします。

### 名前の衝突を避け、役割を明確にする
CSSには機能的にスコープを作ることはできないので、名前空間によって擬似的にスコープを作る必要があります。名前の重複を避けることができれば、スタイルの意図しない衝突を起こす可能性が下がります。
名前空間でスコープを作るために4つの方法を利用します。

1. MindBEMdingの命名規則をベースとすることでコンポーネント名の衝突を防ぐこと
2. BEMのBlockごとにファイルを分割（モジュール化）することでファイル単位での管理をすること
3. コンポーネントのコンテキストごとにレイヤーを定義して、フォルダに分けることでディレクトリ単位での管理をすること
4. コンポーネントのコンテキストごとに名前空間をつけること

### 見た目を表す名前を避ける
コンポーネントの名前とコンテキストは一致することが望ましいです。コンポーネントの見た目は変更される可能性がありますが、コンテキストが変わることはないからです。コンポーネント名が見た目を表していた場合、見た目の変更は大幅なHTMLの修正につながってしまう可能性が高くなります。

見た目を表すコンポーネント名にしなければいけない場合は、変数や@apply Ruleなどで抽象化をしてから使うようにします。

### 詳細度と読み込み順を管理する
スタイルが期待通りに適応されるようにするために3つの方法を利用します。

1. 結合子をもたないクラスの指定をベースにして詳細度をできるだけ低く保つこと
2. スタイルシートの序盤はできるだけ詳細度を低く、徐々に高くすること
3. 優先的に適応したいコンポーネントほどスタイルシートの後半で指定すること

### コンポーネントを拡張可能にする
コンポーネントは拡張を前提として考えます。コンポーネントはベースとなる構造を持ち、バリエーションはBEMのModifierやSMACSSのStateで拡張します。

### コンポーネント同士の関係性
あるコンポーネント内のカスケーディング（例えばバリエーション違いでスタイルを上書きすることなど）に制限はありません。カスケーディングが問題になるのはコンポーネント同士のカスケーディングです。

コンポーネントは**上書きされるコンポーネント**と**上書きするコンポーネント**を区別することで関係性を明確にします。コンポーネント同士の方向性を一致させることでスタイルの衝突を防ぎます。上書きされるコンポーネントは上書きに適したスタイルの指定をする必要があります。

### コンポーネントとレイアウト
コンポーネントによってユーザーインターフェイスが決まり、レイアウトによってコンポーネントの配置が決まります。

コンポーネントとレイアウトは疎結合にして、それぞれの役割を明確にします。コンポーネント自身は内包している要素のレイアウトを指定することはできますが、コンポーネント同士のレイアウトは指定することができません。

## 命名規則
クラス名の命名規則はBEM（[MindBEMding](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)）をベースにします。  
BEMはBlock、Element、Modifierという関係性を示すことでコードを理解しやすくします。コンポーネントもBEMをベースに作っていきます。

DORCSSでは単語をローワーキャメルケースにすることで、BEMを構成する要素を把握しやすくします（一貫性を保持できるのであれば他の命名規則を使うこともできます）。

```css
.blockName {}
.blockName__elementName {}
.blockName--modifierName {}
.blockName__elementName--modifierName {}
```

```html
<div class="blockName blockName--modifierName">
  <div class="blockName__elementName blockName__elementName--modifierName"></div>
  <div class="blockName__elementName">
    <div class="blockName__subElement"></div>
    <div class="blockName__subElement"></div>
  </div>
</div>
```

Blockは2つの単語をつなげることを推奨しますが、Blockがネームスペースとなるため、ElementとModiferは1つの単語だけでもかまいません。

```css
.blockName {}
.blockName__element {}
.blockName__element--modifier {}
.blockName--modifier {}
```

```html
<div class="blockName blockName--modifier">
  <div class="blockName__element blockName__element--modifier"></div> 
  <div class="blockName__element">
    <div class="blockName__subElement"></div>
    <div class="blockName__subElement"></div>
  </div>
</div>
```

基本的にクラスセレクタ単体（0,0,1,0）で指定します。  
ただし、以下のように指定が冗長になってしまう場合はModiferとElementを結合子でつなぐこともできます。

```css
/* CSSはシンプルだけど… */
.blockName__element {}
.blockName__element--modifier {}
```

```html
<!-- 冗長なマークアップになってしまう… -->
<div class="blockName">
  <div class="blockName__element blockName__element--modifier"></div>
  <div class="blockName__element blockName__element--modifier"></div>
  <div class="blockName__element blockName__element--modifier"></div>
</div>
```

```css
/* CSSが複雑にならない範囲であれば */
.blockName--Modifier > .blockName__element {}
```

```html
<!-- ModifierでElementを拡張する -->
<div class="blockName blockName--Modifier">
  <div class="blockName__element"></div>
  <div class="blockName__element"></div>
  <div class="blockName__element"></div>
</div>
```

詳細度は（0,0,1,0）から（0,0,2,0）に上がってしまいますが、大きなデメリットにはならないと考えています。ただし、直近の要素（`>`）に対して指定するなどして、影響範囲ができるだけ狭くなるようにします。

JavaScriptを使った動的なスタイルはSMACSSのStateクラスを使います。Stateクラス自体にスタイルを指定することは禁止します。

```css
/* Good */
.blockName.is-active {}
.blockName__element.is-active {}

/* Bad */
.is-active {}
.is-curent {}
``` 

ネストを使った省略記法は（Stateクラスを含む）状態変化やメディアクエリの使用を基本とします。他のコンポーネントをセレクタとしてつかうこともできますが、`&`で参照されるセレクタが常にルートにあるキーセレクタになるようにします。

```scss
// Good
.blockName {}
.blockName__element {}
.blockName__element--modifier {}
.blockName--modifier {}

// Good
.blockName {
  &:before {}
  & > .block2 {}
  &.is-active {}
}

// Bad
.blockName {
  &__element {
    display: block;
    &--modifier {
      display: none;
    }
  }
  &--modifier {
    display: table;
  }
}
```

## モジュール化
BEMで表現したコンポーネントはモジュールとして1つのファイルにまとめます。Block名とファイル名を同じにすることで、コンポーネントを把握・管理しやすくします。PostCSSではpostcss-importを、Sassでは標準機能の`@import`を使います。

- `.button` => `_button.css`
- `.listInline` => `_listInline.css`

Stateクラスやメディアクエリなど、Blockに関わるスタイルは同じファイル内に保存します。

## レイヤー化
モジュール化したファイルは3つの基準にもとづいてカテゴライズをして、読み込み順を管理します。

- 低詳細度から高詳細度
- 内包（上書き）される要素から内包（上書き）する要素
- 抽象的から具体的

```
css
├── common.css
├── setting/
├── tool/
├── base/
├── atoms/
├── molecules/
├── organisms
│   ├── global
│   └── toppage
├── templates/
├── pages/
└── utility/
```

ページ特有のスタイルを多く含む場合は、ページ専用のCSSファイルを作ることもできます。

```
root
├── assets/
│   └── css/
│       ├── common.css
│       ├── setting/
│       ├── tool/
│       ├── base/
│       ├── atoms/
│       ├── molecules/
│       ├── organisms/
│       │   ├── global/
│       │   └── toppage/
│       ├── templates/
│       ├── pages/
│       └── utility/
├── css/
│   └── index.css
├── index.html
└── page/
    ├── css/
    │   └── index.css
    └── index.html
```

無理に1つのCSSとして管理するよりスタイルの追加や削除がしやすくなり、common.cssの肥大化・複雑化を防ぐことができます。

### 1. Setting
Settingレイヤーではグローバルに使用される変数を定義します。Sassでは`$`変数で定義します。例えば、サイトの`max-width`やフォントのサイズ、余白や色に関するものです。

Custom Propertiesもカスケーディングの対象となるため、定数のように扱います。

```css
@import "setting/_setting.css";
```

```css
:root {
  --max-width: 1080px;
  --color: #000;
  --color--link: #2b70ba;
  --background-color: #fff;
  --border-radius: 3px;
  --font-size--secondary: 0.85em;
  --font-weight--normal: 400;
  --font-weight--bold: 600;
}
```

### 2. Tool
ToolレイヤーではCustom SelectorsやCustom Media Queries、@apply Ruleを使った汎用的なルールを定義します。Sassでは@functionや@mixinで定義します。

```css
@import "tool/_tool.css";
```

```css
@custom-selector :--onEvent :hover, :active, :focus;

@custom-media --md-up (min-width: 768px);
@custom-media --lg-up (min-width: 1080px);
@custom-media --xl-up (min-width: 1440px);
@custom-media --md-down (max-width: 767px);
@custom-media --lg-down (max-width: 1079px);
@custom-media --xl-down (max-width: 1439px);
@custom-media --default (--md-up);

:root {
  --clearfix: {
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }

  --listUnstyled: {
    padding-left: 0;
    list-style-type: none;
  }

  --truncate: {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  --srOnly: {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    border: 0;
    overflow: hidden;
    padding: 0;
    clip: rect(0, 0, 0, 0);
  }
}
```

### 3. Base
Baseレイヤーでは要素セレクタや属性セレクタのようなコンポーネントのベースとなるスタイルを定義します。Normalize.cssもこのレイヤーに含まれます。

詳細度はクラスセレクタと同じ0,0,1,0以下になるように極力低くします。メディアクエリや擬似クラスのような、ある状況や状態に対するスタイルは極力持つべきではありません。

コンポーネント間の余白を管理しやすくするために、上下方向の`margin`は`0`にリセットしておくのを推奨します。ただし、過度なリセットは禁止します。  
継承を利用するために、ルート要素の`font-size`はパーセンテージで指定（`62.5%`の指定は禁止）、その他の要素は`rem`と`em`で指定します。

```css
@import "../../node_modules/normalize.css/normalize.css";
@import "base/_base.css";
```

```css
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

html {
  font-size: calc((15 / 16) * 100%);
  line-height: 1.6;

  @media (--default) {
    font-size: calc((16 / 16) * 100%);
  }
}

body {
  color: var(--color);
  font-family: "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  font-weight: var(--font-weight--normal);
  background-color: var(--background-color);
}

h1, h2, h3, h4, h5, h6,
ul, ol, dl,
blockquote, p, address,
hr,
table,
fieldset, figure,
pre {
  margin-top: 0;
  margin-bottom: 0;
}
```

### 4. Atoms
Atoms（アトム）は機能的にこれ以上分割ができない最小の要素です。例えば、見出しやリスト、フォームラベルやボタンなどが該当します。

Atomsはコンテキストを含んだ名前にします。シングルクラスで指定したり、後述するMoleculesで呼び出せるように@apply Ruleなどを使いますが、過度に複雑にしてはいけません。  
カラーパレットやアニメーションもAtomsとされていますが、SettingとToolに定義して読み込み順を管理しています。

MoleculesとOrganismsのスタイルを継承できるように`em`での指定を基本とします。

テキストやリストのような文章を書くためのコンポーネントはAtoms単体で使用することがあります。  
名前空間として`.a-`をつけます。

```css
@import "atoms/_icon.css";
@import "atoms/_iconExtend.css";
@import "atoms/_title.css";
@import "atoms/_heading2.css";
@import "atoms/_heading3.css";
@import "atoms/_lead.css";
@import "atoms/_textEmphasis.css";
@import "atoms/_textAttention.css";
@import "atoms/_textSecondary.css";
@import "atoms/_listOrder.css";
@import "atoms/_listNote.css";
@import "atoms/_listNoteOrder.css";
@import "atoms/_listBracketOrder.css";
@import "atoms/_link.css";
@import "atoms/_linkMore.css";
@import "atoms/_linkExternal.css";
@import "atoms/_linkPdf.css";
@import "atoms/_linkDownload.css";
@import "atoms/_linkNote.css";
@import "atoms/_linkReturn.css";
@import "atoms/_divider.css";
@import "atoms/_embed.css";
@import "atoms/_label.css";
@import "atoms/_button.css";
@import "atoms/_formInput.css";
@import "atoms/_formTextarea.css";
@import "atoms/_formSelect.css";
@import "atoms/_formCheckbox.css";
@import "atoms/_formRadio.css";
```

### 5. Molecules
Molecules（モルキュール）はAtomsを組み合わせたような比較的シンプルなUIグループです。例えば、検索フォームはlabelとinput、buttonが組み合わさったMoleculesです。

Moleculesはシンプルで機能的なコンポーネントにすることを推奨します。これにより、扱いやすく、メンテナンス性が高く、一貫性を保ったUIにすることができます。

後述するOrganismsのスタイルを継承できるように`em`での指定を基本とします。  
名前空間として`.m-`をつけます。

```css
@import "molecules/_inlineGroup.css";
@import "molecules/_listMark.css";
@import "molecules/_figure.css";
@import "molecules/_ratio.css";
@import "molecules/_block.css";
@import "molecules/_table.css";
@import "molecules/_media.css";
@import "molecules/_flag.css";
@import "molecules/_breadcrumb.css";
@import "molecules/_postSummary.css";
@import "molecules/_postFeature.css";
@import "molecules/_buttonGroup.css";
@import "molecules/_searchForm.css";
```

### 6. Organisms
Organisms（オルガニズム）はAtomsやMolecules、または複数のMoleculesを組み合わせた比較的複雑なUIグループです。例えば、グローバルヘッダーはロゴとグローバルナビゲーション、検索フォームなどが組み合わさったOrganismsです。OrganismsはMoleculesよりも具体的なコンテキストをもつコンポーネントです。  

AtomsとMoleculesなどの配置がパターン化できるものはOrganismsになることが多いです。逆に、AtomsとMoleculesなどの配置がページごとに変わる場合はTempletesでレイアウトをします。

名前空間はコンテキストにあわせてつけます。例えば、`.tp-`（トップページ）や`.glb-`（グローバル）などです。名前空間ごとにディレクトリをわけて管理をします。

```css
@import "organisms/_globalHeader";
@import "organisms/_globalFooter";
@import "organisms/_articleList";
@import "organisms/toppage/hero.css";
```

### 7. Templates
Templates（テンプレート）はページレベルのオブジェクトで、コンポーネント（Atoms・Molecules・Organisms）を配置してページの構成を整えます。

ワイヤーフレームのような大きなレイアウトから、コンポーネント単位のレイアウトまで様々です。コンポーネントにダミーのテキストや画像を挿入することで、コンテンツの量や大きさによって意図しないデザインになってしまわないかをテストすることができます。  
名前空間として`.t-`をつけます。

```css
@import "templates/_grid.css";
@import "templates/_header.css";
@import "templates/_content.css";
@import "templates/_sidebar.css";
@import "templates/_footer.css";
@import "templates/_wrapper.css";
```

### 8. Pages
Pages（ページ）では実際のコンテンツを挿入して最終的な外観を確認します。

PagesはTemplatesの動的なバリエーションです。例えば、ログインしているか、カートに入っているかといった特定の状況や、実際の画像やテキストを入れたときにレイアウトが崩れることはないかなどを確認します。スタイルの追加はあまりないと考えます。  
名前空間として`.p-`をつけます。

### 9. Utility
Utilityレイヤーは汎用クラスを定義します。シングルクラスでも確実にスタイルを適応させるために`!important`を指定することを推奨します。

コンポーネントがUtilityコンポーネントで成り立ってしまうことはできるだけ避けます。Utilityコンポーネントは他のレイヤーが持つよりも汎用的に使えたり、コードが冗長になってしまう場合に使います。

pxのような絶対値ではなく、remや%のような相対値を指定することを推奨します。  
名前空間として`.u-`をつけます。

```css
@import "utility/_align.css";
@import "utility/_text.css";
@import "utility/_display.css";
@import "utility/_col.css";
```

### ライブラリ、フレームワーク、プラグイン
CSSのライブラリやフレームワーク、JQueryプラグインのCSSファイルなどを追加する場合もBaseからUtilityの基準にもとづいてカテゴライズします。  
外部のCSSだからといって、役割や機能が変わることはないからです。

例えばnormalize.cssはBaseレイヤー、スライダーのようなJQueryプラグインはOrganismsレイヤーが適切な場所になります。

CSSファイルは直接編集をせず、librarynameExtend.cssのようなファイルを用意して上書きをします。記述が冗長になってしまう場合は直接編集してもかまいません。

## 名前空間

- Atoms - `.a-`
- Molecules - `.m-`
- Organisms - コンテキストにあわせる
- Templates - `.t-`
- Pages - `.p-`
- utility - `.u-`

レイヤーやコンテキストに基づいた名前空間をつけます。

ライブラリ、フレームワーク、プラグインは独自の名前空間があるものを使うことを推奨します。

### サフィックス
ブレイクポイントをもっているオブジェクトにはクラス名の末尾にサフィックス（接尾辞）をつけます。  
一貫性をもたせることで機能を明確にすることができます。

ブレイクポイントは`-sp`や`-pc`のようなデバイスを基準とせず、`-sm`や`-lg`のような相対的な名前を使います。

- xs(Extra small) - `-xs`
- sm(Small) - `-sm`
- md(Medium) - `-md`
- lg(Large) - `-lg`
- xl(Extra large) - `-xl`

## コメント
コメントにはコードだけでは理解できない（しにくい）情報を残します。例えば以下のようなものです。

- 全体を見渡せるような目次
- レイヤーやモジュールの区切りをわかりやすくするための見出し
- なぜその実装方法を選んだのかという理由
- コードの整理をしたい、バグを修正したいといった、コードからはわからない情報
- コード自体の補足

### 目次（Table of Contents）
スタイルシートのボリュームが一定以上になると全体の把握は難しくなります。CSSでもSassでも利用できる目次をスタイルシートのはじめに用意しておくことを推奨します。

```css
/**
 * SETTING
 * setting...Custom Propertiesを使ったグローバル変数です。
 *
 * TOOL
 * tool...Custom SelectorsやCustom Media Queries、@apply Ruleを使った汎用的なルールです。
 *
 * BASE
 * normalize...Normalize.cssをインポートしています。
 * base...タイプセレクタと属性セレクタのデフォルトスタイルです。
 *
 * ATOMS
 * icon...アイコンフォントです。テンプレートから自動で生成されます。
 * iconExtend...アイコンにスタイルを追加します。
 * title...`<h1>`で使われる見出しのスタイルです。
 * heading2...`<h2>`で使われるような見出しのスタイルです。
 * heading3...`<h3>`で使われるような見出しのスタイルです。
 * lead...視覚的に目立たせるときに使うスタイルです。
 * textEmphasis...強調や重要性を示すときに使います。
 * textAttention...注意や注目を引きたい場合に使います。
 * textSecondary...副次的な意味合いを持たせる場合に使います。
 * list...リストアイテムの左に役物などを表示します。
 * link...テキストリンクのデフォルトスタイルです。
 * linkMore...クリックを促すようなテキストリンクに使います。
 * linkExternal...外部リンクであることを示す場合に使います。
 * linkPdf...リンク先がPDFであることを示す場合に使います。
 * linkDownload...ファイルをダウンロードするためのリンクであることを示す場合に使います。
 * linkNote...注釈へのリンクです。`<sup>`タグの子要素として指定します。
 * linkReturn...注釈から参照元に戻るためのリンクです。
 * divider...`<hr>`のような区切り記号を使って、分割・グルーピングします。
 * embed...Youtubeなどをレスポンシブ対応させます。
 * label...インラインで表示するラベルコンポーネントです。
 * button...ボタンのデフォルトスタイルです。
 * formInput...`<input>`のデフォルトスタイルです。
 * formTextarea...`<textarea>`のデフォルトスタイルです。
 * formSelect...`<select>`のデフォルトスタイルです。
 * formCheckbox...`type="checkbox"`のデフォルトスタイルです。
 * formRadio...`type="radio"`のデフォルトスタイルです。
 *
 * MOLECULES
 * listInline...ボタンやラベル、テキストリンクなどを横並びにします。
 * listMark...リストアイテムの左にアイコンを配置します。
 * figure...キャプションをつけた画像オブジェクトです。
 * ratio...アスペクト比を固定したまま伸縮させます。
 * block...画像とテキストを縦に配置します。
 * table...`<table>`のベースとなるスタイルです。
 * media...画像とテキストが横並びになるオブジェクトです。
 * flag...画像とテキストが横並びになるオブジェクトです。垂直方向の指定ができます。
 * breadcrumb...パンくずリストオブジェクトです。
 * postSummary...ページへの画像リンクです。画像と見出しなどの概要を伴います。
 * postFeature...ページへの画像リンクです。（`.m-postSummary`よりも）特に目立たせたい主要なページへの誘導に使います。
 * buttonGroup...2つのボタンをグルーピングします。
 * searchForm...検索フォームコンポーネントです。
 *
 * ORGANISMS
 * global
 * header...グローバルヘッダーです。
 * footer...グローバルフッターです。
 * blog...ブログ内のスタイルです。
 *
 * TEMPLATES
 * grid...汎用的なグリッドオブジェクトです。
 * header...グローバルヘッダーのレイアウトを指定します。
 * content...コンテンツエリアのレイアウトを指定します。
 * sidebar...サイドバーエリアのレイアウトを指定します。
 * footer...グローバルフッターのレイアウトを指定します。
 * wrapper...グローバルヘッダーやグローバルフッター、メインコンテンツやサイドバーといったサイトの基本となるレイアウトを指定します。
 *
 * PAGES
 *
 * UTILITY
 * image...画像の汎用スタイルです。
 * text...テキストのスタイルに関するスタイルです。
 * display...`<br>`タグに指定をして、改行をブレイクポイントごとにコントロールします。
 * col...レスポンシブに対応した`width`プロパティを指定します。
 */
```

### レイヤータイトル
レイヤー名や、どのような特徴のあるレイヤーなのかを情報として残しておくとコードを理解しやすくなります。

```css
/* =============================================================================
   #Setting
   ========================================================================== */
/**
 * SettingレイヤーではCustom Propertiesを使ったグローバル変数を定義します。
 * Sassでは`$`変数で定義します。
 * 例えば、サイトのmax-widthやフォントのサイズ、余白や色に関するものです。
 * Custom Propertiesもカスケーディングの対象となるため、定数のように扱います。
 * 非対応ブラウザがある場合、変数はコード内に変換され、コメントのみが残ります。
 */
@import "setting/_setting.css";
```

### モジュールタイトル
モジュール化したファイルにはオブジェクトの名前や機能をコメントとして残します。スタイルガイドジェネレーター用のコメントを残してもいいでしょう。以下は[Aigis](https://pxgrid.github.io/aigis/)のコメントです（シンタックスハイライトを有効にするため一部記述を変えています）。

```css
 /* #button
   -------------------------------------------------------------------------- */
/*
---
name: button
category: Atoms
tag: Form
---

ボタンのデフォルトスタイルです。

---jade
a.a-button(href="#") ボタン
button.a-button(type="button") ボタン
input.a-button(type="button" value="ボタン")
a.a-button.is-disabled(href="#") .is-disabled
button.a-button(type="button" disabled) disabled
input.a-button(type="button" disabled value="disabled")
---
*/
.a-button {
  display: inline-block;
  margin: 0;
  padding: 1em 2em;
  border: none;
  border: 1px solid #d0d0d0;
  border-radius: var(--form--border-radius);
  color: #fff;
  font-family: inherit;
  font-size: 1em;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  background: transparent;
  background-color: var(--color--link);
  cursor: pointer;
  appearance: none;
  transition-duration: var(--form--transition-duration);
  transition-property: var(--form--transition-property);

  &:--onEvent {
    text-decoration: none;
  }

  &:focus {

  }

  &:disabled {
    cursor: var(--form--disabled-cursor);
    opacity: var(--form--disabled-opacity);
    background-color: var(--form--disabled-background-color);
  }
}

.a-button.is-disabled {
  cursor: var(--form--disabled-cursor);
  opacity: var(--form--disabled-opacity);
  background-color: var(--form--disabled-background-color);
  pointer-events: none;
}

.a-button--full {
  width: 100%;
}

.a-button--primary {}
.a-button--secondary {}
.a-button--tertiary {}
.a-button--quaternary {}
.a-button--search {}
```

### 注意事項とTODO
あとで処理をしたいことや、把握しておいてほしい注意事項はコメントに残していつでも検索できるようにします。

- `NOTE:` コード上で確認できない制限などの共有
- `TBD:` 今後どうしていくか検討したいこと
- `TODO:` 動作はするけれど改修したい箇所
