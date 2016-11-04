# DORCSS(division of roles CSS)

DORCSS（ドールシーエスエス）はRole（役割）を分担・分割（Division）することで影響範囲を管理する、CSS設計の構成案です。

基本的な考え方は、

- 詳細度はできるだけ低く、徐々に強くすること
- コンポーネントの役割を定義し、装飾と配置に関するルールと上書きに関するルールを明確にすること
- 命名規則によって名前とスタイルの衝突を避け、コンポーネントが持つ役割を明確にすること

[OOCSS](https://github.com/stubbornella/oocss)、[SMACSS](https://smacss.com/ja)、[BEM](https://en.bem.info/)、[FLOCSS](https://github.com/hiloki/flocss)、[ITCSS](https://speakerdeck.com/dafed/managing-css-projects-with-itcss)、Atomic Desing、[large-scale-javascript](https://github.com/azu/large-scale-javascript)に強く影響を受けています。

命名規則、モジュール化、レイヤー、プレフィックスという4つの方法で役割と影響範囲を管理します。

DORCSSでは以下のような用語を使います。

- コンポーネント- 役割をもった部品
- モジュール - コンポーネントをファイル化したもの
- レイヤー - モジュール化したコンポーネントをカテゴライズした状態
- 装飾 - `color`や`background-color`のような見た目に関すること
- 構造 - `display`や`padding`のようなコンポーネントの骨格に関すること
- 配置 - `margin`や`position`などのコンポーネントのレイアウトに関すること
- Content - 内包されるコンポーネント
- Container - 内包するコンポーネント

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
複数の`.blockName__element--modifier`を指定するなどして冗長になってしまう場合は、`.blockName--modifier > .blockName__element`（0,0,2,0）のように結合子で指定することもできますが、子セレクタを使うなどして範囲をできるだけ限定させます。


JavaScriptを使った動的なスタイルはSMACSSのStateクラスを使います。Stateクラス自体にスタイルを指定することは禁止します。

```css
/* Good */
.blockName.is-active {}
.blockName__element.is-active {}

/* Bad */
.is-active {}
.is-curent {}
``` 

環境によってはネストを使った省略記法が使えますが、（Stateクラスを含む）状態変化やメディアクエリ以外の使用を禁止します。セレクタが常に明確になるように書くことで保守性を維持します。

```scss
// Good
.blockName {}
.blockName__element {}
.blockName__element--modifier {}
.blockName--modifier {}

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
├── Foundation/
│   ├── Setting/
│   ├── Tool/
│   └── Base/
├── Parts/
├── Container/
├── Layout/
├── Scope/
└── Utility/
```

ページ特有のスタイルを多く含む場合は、ページ専用のCSSファイルを作ることもできます。

```
root
├── assets/
│   └── css/
│       ├── common.css
│       ├── foundation/
│       │   ├── Setting/
│       │   ├── Tool/
│       │   └── Base/
│       ├── Parts/
│       ├── Container/
│       ├── layout/
│       ├── Scope/
│       └── Utility/
├── css/
│   └── index.css
├── index.html
└── page/
    ├── css/
    │   └── index.css
    └── index.html
```

無理に1つのCSSとして管理するよりスタイルの追加や削除がしやすくなり、common.cssの肥大化・複雑化を防ぐことができます。

### 1. Foundation
FoundationレイヤーではNormalize.cssやリセットCSS、要素セレクタや属性セレクタのようなコンポーネントのベースとなるスタイルを定義します。

SettingレイヤーとToolレイヤーでは、Custom Propertiesや@apply Rule、Sassの変数や@mixinなどで変数と関数を管理します。

### 1-1. Setting
Settingレイヤーではグローバルに使用される変数を定義します。例えば、サイトの`max-width`やフォントのサイズ、余白や色に関するものです。

```css
@import "foundation/setting/_setting.css";
```

```css
:root {
  --max-width: 960px;
  --color: #000;
  --color--link: #2b70ba;
  --background-color: #fff;
  --border-radius: 3px;
}
```

### 1-2. Tool
ToolレイヤーではCustom SelectorsやCustom Media Queries、@apply Ruleなどを使ったルールを定義します。Sassでは@functionや@mixinで定義します。

```css
@import "foundation/tool/_tool.css";
```

```css
@custom-selector :--onEvent :hover, :active, :focus;

@custom-media --md-up screen and (min-width: 768px);
@custom-media --lg-up screen and (min-width: 1000px);
@custom-media --md-down screen and (max-width: 767px);
@custom-media --lg-down screen and (max-width: 999px);

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
}
```

### 1-3. Base
BaseレイヤーではNormalize.cssやリセットCSS、要素セレクタや属性セレクタのようなコンポーネントのベースとなるスタイルを定義します

詳細度はクラスセレクタと同じ0,0,1,0以下になるように極力低くします。メディアクエリや擬似クラスのような、ある状況やある状態に対するスタイルは極力持つべきではありません。

自分自身の構造を持つことはできますが、装飾と配置、コンポーネントを内包することはできません。

リセットをするよりも継承を利用するようにします。コンポーネント間の余白を管理しやすくするために、上下方向の`margin`は`0`にリセットしておくのを推奨します。

```css
@import "../node_modules/normalize.css/normalize.css";
@import "foundation/base/_base.css";
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
  font-size: 15px;
  line-height: 1.6;
  @media (--md-up) {
    font-size: 16px;
  }
}

body {
  color: var(--color);
  font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  font-weight: 400;
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

### 2. Parts
Partsレイヤーは装飾的なスタイルを持つことができる再利用可能で小さなコンポーネントを定義します。

```css
@import "parts/_label.css";
@import "parts/_button.css";
@import "parts/_embed.css";
@import "parts/_listNote.css";
@import "parts/_listOrdered.css";
@import "parts/_headingH2.css";
@import "parts/_headingH3.css";
```

目安としては、見出しやリスト、ボタンやラベルのような他のコンポーネントを内包できない小さなコンポーネントです。内包されるコンポーネントなので配置に関する情報を持つことはできません。

プレフィックス（接頭辞）として`.p-`をつけます。

### 3. Container
ContainerレイヤーはPartsレイヤーを内包できる比較的大きなコンポーネントを定義します。  
Containerレイヤー同士での依存関係がうまれることもあります。内包されるコンポーネントは内包するコンポーネントよりも先に読み込むことで期待通りに適応されるようにしておきます。

```css
@import "container/_listInline.css";
@import "container/_listMark.css";
@import "container/_breadcrumb.css";
@import "container/_figure.css";
@import "container/_ratio.css";
@import "container/_block.css";
@import "container/_table.css";
@import "container/_media.css";
@import "container/_flag.css";
```

Containerコンポーネントがユーザーインターフェイスの見た目と構造を確定するので、自分自身と内包するコンポーネントに対して具体的な情報を持つべきです。

```html
<div class="c-blockGrid">
  <div class="c-blockGrid__item"></div>
  <div class="c-blockGrid__item">
    <h2 class="p-headingH2"></h2> 
    <p></p>
  </div>
</div>
```

```css
.c-blockGrid__item > .p-headingH2 {}
```

ただし、役割がより明確になり詳細度を低く保てるように、内包するコンポーネントに直接指定するのではなく、自身のElementに対して指定することを推奨します。これによって、内包されるコンポーネント自体のスタイルとそれを上書きした状態のスタイルを使い分けることもできます。

```html
<div class="c-blockGrid">
  <div class="c-blockGrid__item"></div>
  <div class="c-blockGrid__item"> 
    <h2 class="c-blockGrid__heading p-headingH2"></h2>
    <p></p>
  </div>
</div>
```

```css
.c-blockGrid__heading {}
```

基本的にはContainerコンポーネント自身の配置を指定することはできませんが、JavaScriptで動的に表示や配置の変更がされるUIの場合は許容されます。

プレフィックス（接頭辞）として`.c-`をつけます。

### 4. Layout
Layoutレイヤーはワイヤーフレームに出てくるような大枠のレイアウトを担当するコンポーネントを定義します。Layoutコンポーネントによってページ内のレイアウトが確定します。  
グリッドのようなレイアウト専用のコンポーネントもこのレイヤーに含みます。

```css
@import "layout/_grid.css";
@import "layout/_wrapper.css";
@import "layout/_header.css";
@import "layout/_footer.css";
@import "layout/_content.css";
```

装飾的なスタイルを持つことも、内包するモジュールを上書きすることもできません。Layoutコンポーネントは完全にレイアウトに特化したコンポーネントです。

内包するコンポーネントのレイアウトは自身のElementで指定します。内包するコンポーネントと同じ要素に指定することを避けて、コンポーネント同士が干渉しないようにします。

```html
<div class="l-globalHeader">
  <div class="l-globalHeader__logo">
    <h1 class="p-logo"></h1>
  </div>
  <nav class="l-globalHeader__nav">
    <ul class="c-globalNav">
      <li class="c-globalNav__item"></li>
      <li class="c-globalNav__item"></li>
    </ul>
  </nav>
</div>
```

プレフィックス（接頭辞）として`.l-`をつけます。

### 5. Scope
Scopeレイヤーはカテゴリやブログのような特定の範囲でのスタイルを定義します。コンポーネント単位ではなく、任意の範囲（スコープ）に対するスタイルを指定します。

```css
@import "scope/_blog.css";
```

Scopeレイヤー自身も内包するコンポーネントにも装飾的なスタイルや配置に関する指定をすることもできる、影響範囲の大きなレイヤーです。

影響範囲ができるだけ小さくなるように適応する範囲や要素を限定しなければいけません。例えば`.s-scope .p-button--prymary`ではなく、`.p-button--prymary`と`.s-scope__button`のマルチクラスで指定します。

```html
<!-- Allow -->
<div class="s-scope">
  <a class="p-button p-button--prymary" href="#"></a>
</div>

<!-- Good -->
<a class="p-button p-button--prymary s-scope__button" href="#"></a>
```

プレフィックス（接頭辞）として`.s-`をつけます。

### 6. Utility
Utilityレイヤーは汎用クラスを定義します。シングルクラスでも確実にスタイルを適応させるために`!important`を指定することを推奨します。

```css
@import "utility/_align.css";
@import "utility/_text.css";
@import "utility/_display.css";
@import "utility/_width.css";
```

コンポーネントがUtilityコンポーネントで成り立ってしまうことはできるだけできるだけ避けます。基本的にコンポーネントは自分自身で役割を果たせるように考えるべきです。

Utilityコンポーネントは他のレイヤーが持つよりも汎用的に使えたり、コードが冗長になってしまう場合に使います。pxのような絶対値ではなく、remや%のような相対値を指定することを推奨します。

プレフィックス（接頭辞）として`.u-`をつけます。

### ライブラリ、フレームワーク、プラグイン
CSSのライブラリやフレームワーク、JQueryプラグインのCSSファイルなどを追加する場合も3つの基準にもとづいてカテゴライズします。  
外部のCSSだからといって、役割や機能が変わることはないからです。

例えばnormalize.cssはFoundation/Baseレイヤー、スライダーのようなJQueryプラグインはContainerレイヤーが適切な場所になります。

CSSファイルは直接編集をせず、librarynameExtend.cssのようなファイルを用意して上書きをします。記述が冗長になってしまう場合は直接編集してもかまいません。

## プレフィックス
レイヤーにカテゴライズしたコンポーネントにはレイヤー名からとったプレフィックスをつけます。

- Parts - `.p-`
- Container - `.c-`
- Layout - `.l-`
- Scope - `.s-`
- utility - `.u-`

レイヤーにもとづいたネームスペースで名前の重複を避け、プレフィックスによってコンポーネントの役割を明確にすることができます。

JavaScriptでのみ参照する要素には`js-`やプレフィックスをつけます。`js-`プレフィックスのついたクラス名とID名にはCSSを指定することを禁止します。

ライブラリ、フレームワーク、プラグインにはプレフィックスのルールを適応しませんが、独自のプレフィックスをもっているものを使うことを推奨します。

### サフィックス
ブレイクポイントをもっているコンポーネントにはクラス名の末尾にサフィックス（接尾辞）をつけます。  
一貫性をもたせることで機能を明確にすることができます。

ブレイクポイントは`-sp`や`-pc`のようなデバイスを基準とせず、`-sm`や`-lg`のような相対的な名前を使います。

- sm(xsmall)
- sm(small)
- md(medium)
- large(large)
- xl(xlarge)

## レイヤーの枠割
レイヤーには役割を持たせ、装飾と配置、上書きに関するルールを定義します。

### コンポーネント自身の役割
自分自身とはBEMでいうBlockのことです。配置するとは`margin`や`float`、`position`プロパティなどでコンポーネント間の間隔や位置関係を変更することです。

| レイヤー名   | 自分自身を装飾すること   | 自分自身を配置すること   |
|------------ |------------------------ |------------------------ |
| Base        | 禁止                    | 禁止                    |
| Parts       | 推奨                    | 禁止                    |
| Container   | 推奨                    | 許容                    |
| Layout      | 禁止                    | 推奨                    |
| Scope       | 許容                    | 許容                    |
| Utility     | 許容                    | 禁止                    |


### 内包しているコンポーネントへの影響範囲
内包するコンポーネントとは別のコンポーネントのことです。Blockに対するElementではありません。

| レイヤー名   | 内包するコンポーネントを装飾すること    | 内包するコンポーネントを配置すること    |
|------------ |-------------------------------------- |-------------------------------------- |
| Base        | 禁止                                  | 禁止                                  |
| Parts       | 禁止                                  | 禁止                                  |
| Container   | 許容                                  | 推奨                                  |
| Layout      | 禁止                                  | 推奨                                  |
| Scope       | 許容                                  | 許容                                  |
| Utility     | 禁止                                  | 禁止                                  |


### 役割と詳細度
| レイヤー名   | 役割                  | 詳細度   |
|------------ |---------------------- |-------- |
| Base        | グローバル             | 低       |
| Parts       | Content               | 中       |
| Container   | Container             | 中       |
| Layout      | Container             | 中       |
| Scope       | 任意の範囲             | 中       |
| Utility     | Content               | 高       |

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
 * setting...CSS Variablesを使ったグローバル変数です。
 *
 * TOOL
 * tool...Custom SelectorsやCustom Media Queries、@apply Ruleを使ったルールです。
 *
 * BASE
 * normalize...Normalize.cssをインポートしています。
 * base...タイプセレクタと属性セレクタのデフォルトスタイルです。
 *
 * PARTS
 * icon...アイコンフォントです。テンプレートから自動で生成されます。
 * button...ボタンコンポーネントです。
 *
 * CONTAINER
 * listInline...ボタンやラベル、テキストリンクなどを横並びにします。
 * listMark...リストアイテムの左にアイコンを配置します。
 *
 * LAYOUT
 * grid...汎用的なグリッドコンポーネントです。`width`の変更はUtilityレイヤーで指定します。
 * content...コンテンツエリアの余白を管理します。
 *
 * SCOPE
 * blog...ブログエリアのスタイルです。
 *
 * UTILITY
 * align...画像などを左右や中央に配置します。
 * width...レスポンシブに対応した`width`プロパティを指定する汎用クラスです。
 */
```

### レイヤータイトル
どこのレイヤーにいるのか、どういった特徴のあるレイヤーなのか、などを残しておくとコードを理解しやすくなります。

```css
/* =============================================================================
   #Foundation
   ========================================================================== */
/**
 * FoundationレイヤーではNormalize.cssやリセットCSS、
 * 要素セレクタや属性セレクタのようなコンポーネントのベースとなるスタイルを定義します。
 * SettingレイヤーとToolレイヤーでは、
 * CSS Variablesや@apply Rule、Sassの変数や@mixinなどで変数と関数を管理します。
 */
@import "foundation/setting/_setting.css";
@import "foundation/tool/_tool.css";

/* -----------------------------------------------------------------------------
   #Base
   -------------------------------------------------------------------------- */
/**
 * BaseレイヤーではNormalize.cssやリセットCSS、
 * 要素セレクタや属性セレクタのようなコンポーネントのベースとなるスタイルを定義します
 * 詳細度はクラスセレクタと同じ0,0,1,0以下になるように極力低くします。
 * メディアクエリや擬似クラスのような、ある状況やある状態に対するスタイルは極力持つべきではありません。
 * 自分自身の構造を持つことはできますが、装飾と配置、コンポーネントを内包することはできません。
 * リセットをするよりも継承を利用するようにします。
 * コンポーネント間の余白を管理しやすくするために、上下方向の`margin`は`0`にリセットしておくのを推奨します。
 */
@import "../../node_modules/normalize.css/normalize.css";
@import "foundation/base/_base.css";
```

### モジュールタイトル
モジュール化したファイルにはコンポーネントの名前や機能をコメントとして残します。スタイルガイドジェネレータ用のコメントを残してもいいでしょう。

```css
 /* #label
   -------------------------------------------------------------------------- */
.p-label {
  display: inline-block;
  padding: 0.5em;
  color: #fff;
  font-size: 0.8rem;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  text-decoration: none;
  background-color: var(--color--link);
  &:--onEvent {
    color: #fff;
    text-decoration: none;
  }
}
```

### 注意事項とTODO
あとで処理をしたいことや、把握しておいてほしい注意事項はコメントに残していつでも検索できるようにします。

- `NOTE:` コード上で確認できない制限などの共有
- `TBD:` 今後どうしていくか検討したいこと
- `TODO:` 動作はするけれど改修したい箇所
