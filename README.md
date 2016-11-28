# DORCSS(division of roles CSS)

DORCSS（ドールシーエスエス）はRole（役割）を分担・分割（Division）することで影響範囲を管理するCSS設計の構成案です。

[OOCSS](https://github.com/stubbornella/oocss)、[SMACSS](https://smacss.com/ja)、[BEM](https://en.bem.info/)、[FLOCSS](https://github.com/hiloki/flocss)、[ITCSS](https://speakerdeck.com/dafed/managing-css-projects-with-itcss)、[Atomic Desing](http://atomicdesign.bradfrost.com/)、[large-scale-javascript](https://github.com/azu/large-scale-javascript)に強く影響を受けています。

DORCSSでは以下のような用語を使います。

- オブジェクト - 役割をもった部品
- モジュール - オブジェクトをファイル化したもの
- レイヤー - モジュールをカテゴライズした状態
- 装飾 - `color`や`background-color`のような見た目に関すること
- 構造 - `display`や`padding`のような骨格に関すること
- 配置 - `margin`や`position`などのレイアウトに関すること

## DORCSSの基本

### 継承
オブジェクトはハードコード（ある状態でだけ正しくふるまうこと）をできるだけ避けるべきです。規模の大きなWebサイトでは1つのデザイン変更で多くのオブジェクトに修正が必要になってしまう恐れがあるからです。

CSSには継承という仕組みがあります。ルート要素にベースとなるスタイルを指定してオブジェクトが継承して利用できるようにします。変数や@apply ruleを併用して一括で管理できるのが理想的です。また、サイズの単位はpxをなるべく避け、remやemをベースにします。

### 名前の衝突と役割の明確化
CSSには機能的にスコープを作ることはできないので、名前によって擬似的にスコープを作る必要があります。名前の重複を避けることができれば、スタイルの意図しない衝突を起こす可能性が下がります。
名前でスコープを作るために4つの方法を利用します。

1. MindBEMdingの命名規則をベースとすることでオブジェクト名の衝突を防ぐこと
2. BEMのBlockごとにファイルを分割（モジュール化）することでファイル単位での管理をすること
3. オブジェクトの役割ごとにレイヤーを定義しフォルダに分けることでディレクトリ単位での管理をすること
4. オブジェクトの役割ごとにプレフィックス（ネームスペース）をつけること

### 見た目を表す名前
オブジェクトの名前と役割は一致することが望ましいです。オブジェクトの見た目は変更される可能性がありますが、役割が変わることはないからです。オブジェクト名が見た目を表していた場合、見た目の変更は大幅なHTMLの修正につながってしまいます。

見た目を表すオブジェクト名にするときは変数や@apply Ruleなどで抽象化をして使うようにします。

### 詳細度と読み込み順
スタイルが期待通りに適応されるようにするために3つの方法を利用します。

1. シングルクラスの指定をベースにして詳細度をできるだけ低く保つこと
2. スタイルシートの序盤はできるだけ詳細度を低く、徐々に高くすること
3. 優先的に適応したいオブジェクトほどスタイルシートの後半で指定すること

### オブジェクトの拡張性
オブジェクトは拡張を前提として考えます。拡張性の高いオブジェクトはベースとなる構造を持ち、バリエーションはBEMのModifierやSMACSSのStateで拡張します。

### オブジェクト同士の関係性
あるオブジェクト内のカスケーディング（例えばバリエーション違いでスタイルを上書きすることなど）に制限はありません。カスケーディングが問題になるのはオブジェクト同士のカスケーディングです。

オブジェクトは**上書きされるオブジェクト**と**上書きするオブジェクト**を区別することで関係性を明確にします。オブジェクト同士の方向性を一致させることでスタイルの衝突を防ぎます。上書きされるオブジェクトは上書きに適したスタイルの指定をする必要があります。

### オブジェクトとレイアウト
オブジェクトによってユーザーインターフェイスが決まり、レイアウトによってオブジェクトの配置が決まります。

オブジェクトとレイアウトは疎結合にして、それぞれの役割を明確にします。オブジェクト自身は内包している要素のレイアウトを指定することはできますが、オブジェクト同士のレイアウトは指定することができません。

## 命名規則
クラス名の命名規則はBEM（[MindBEMding](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)）をベースにします。  
BEMはBlock、Element、Modifierという関係性を示すことでコードを理解しやすくします。オブジェクトもBEMをベースに作っていきます。

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

ネストを使った省略記法は（Stateクラスを含む）状態変化やメディアクエリ以外の使用を禁止します。セレクタが常に明確になるように書くことで保守性を維持します。

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
BEMで表現したオブジェクトはモジュールとして1つのファイルにまとめます。Block名とファイル名を同じにすることで、オブジェクトを把握・管理しやすくします。PostCSSではpostcss-importを、Sassでは標準機能の`@import`を使います。

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
├── Setting/
├── Tool/
├── Base/
├── Component/
├── Project/
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
│       ├── Setting/
│       ├── Tool/
│       ├── Base/
│       ├── Component/
│       ├── Project/
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

### 1. Setting
Settingレイヤーではグローバルに使用される変数を定義します。Sassでは`$`変数で定義します。例えば、サイトの`max-width`やフォントのサイズ、余白や色に関するものです。

Custom Propertiesもカスケーディングの対象となるため、定数のように扱います。

```css
@import "setting/_setting.css";
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

### 2. Tool
ToolレイヤーではCustom SelectorsやCustom Media Queries、@apply Ruleを使った汎用的なルールを定義します。Sassでは@functionや@mixinで定義します。

```css
@import "tool/_tool.css";
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
Baseレイヤーでは要素セレクタや属性セレクタのようなオブジェクトのベースとなるスタイルを定義します。Normalize.cssもこのレイヤーに含まれます。

詳細度はクラスセレクタと同じ0,0,1,0以下になるように極力低くします。メディアクエリや擬似クラスのような、ある状況や状態に対するスタイルは極力持つべきではありません。

オブジェクト間の余白を管理しやすくするために、上下方向の`margin`は`0`にリセットしておくのを推奨します。ただし、過度なリセットは禁止します。  
継承を利用するために、ルート要素の`font-size`はパーセンテージで指定（`62.5%`の指定は禁止）、その他の要素やオブジェクトのサイズは`rem`と`em`で指定します。

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
  @media (--md-up) {
    font-size: calc((16 / 16) * 100%);
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

### 4. Component
Componentレイヤーは装飾的なスタイルを持つことができる再利用可能で小さなオブジェクトを定義します。

```css
@import "component/_icon.css";
@import "component/_iconExtend.css";
@import "component/_label.css";
@import "component/_button.css";
@import "component/_embed.css";
@import "component/_list.css";
@import "component/_headingH2.css";
@import "component/_headingH3.css";
```

目安としては、見出しやリスト、ボタンやラベルのような他のオブジェクトを内包できない小さなオブジェクトです。  
後述するProjectオブジェクトのサイズ変更を継承できるようにサイズ（`font-size`, `margin`, `padding`など）は`em`で指定します。

プレフィックス（接頭辞）として`.c-`をつけます。

### 5. Project
ProjectレイヤーはComponentオブジェクトを内包・上書きできる比較的大きなオブジェクトを定義します。  
Projectレイヤー同士での依存関係がうまれることもあります。内包されるオブジェクトは内包するオブジェクトよりも先に読み込むことで期待通りに適応されるようにしておきます。

```css
@import "project/_listInline.css";
@import "project/_listMark.css";
@import "project/_breadcrumb.css";
@import "project/_figure.css";
@import "project/_ratio.css";
@import "project/_block.css";
@import "project/_table.css";
@import "project/_media.css";
@import "project/_flag.css";
```

Projectオブジェクトがユーザーインターフェイスの見た目と構造を確定するので、自分自身と内包するオブジェクトに対して具体的な情報を持つべきです。

```html
<div class="p-articleList">
  <a class="p-articleList__item" href="#"></a>
  <a class="p-articleList__item" href="#">
    <h2 class="p-articleList__heading c-headingH2"></h2> 
    <p class="p-articleList__text"></p>
  </a>
</div>
```

```css
.p-articleList__heading.c-headingH2 {}
```

ただし、役割がより明確になり詳細度を低く保てるように、内包するオブジェクトに直接指定するのではなく、自身のElementに対してだけ指定することを推奨します。

```css
.p-articleList__heading {}
```

Projectオブジェクトは常にルートを基準にサイズを決めるため、`rem`を基本単位とします。  
ただし、オブジェクトのBlockにフォントサイズを指定すると範囲が大きくなり過ぎるので、Blockは`1rem`を基本として、ElementやModifierでフォントサイズの変更をすることを推奨します。  
オブジェクト内の余白をフォントサイズを基準に指定したい場合は`em`で指定してもいいでしょう。

基本的にはProjectオブジェクト自身の配置を指定することはできませんが、JavaScriptで動的に表示や配置の変更がされるUIの場合は許容されます。

プレフィックス（接頭辞）として`.p-`をつけます。

### 6. Layout
Layoutレイヤーはワイヤーフレームに出てくるような大枠のレイアウトやオブジェクトのレイアウトを定義します。Layoutオブジェクトによってページ内のレイアウトが確定します。  
グリッドのようなレイアウト専用のオブジェクトもこのレイヤーに含みます。

```css
@import "layout/_grid.css";
@import "layout/_header.css";
@import "layout/_content.css";
@import "layout/_sidebar.css";
@import "layout/_footer.css";
@import "layout/_wrapper.css";
```

内包するモジュールを上書きすることはできません。Layoutオブジェクトはレイアウトに特化したオブジェクトです。  
ただし、背景色のようにレイアウトによって影響範囲が変わるものは、最小限であればLayoutオブジェクトに含めることも許容します。

内包するオブジェクトのレイアウトは自身のElementで指定します。内包するオブジェクトと同じ要素に指定することを避けて、オブジェクト同士が干渉しないようにします。

```html
<div class="l-globalHeader">
  <div class="l-globalHeader__logo">
    <h1 class="p-logo"></h1>
  </div>
  <nav class="l-globalHeader__nav">
    <ul class="p-globalNav">
      <li class="p-globalNav__item"></li>
      <li class="p-globalNav__item"></li>
    </ul>
  </nav>
</div>
```

コンテンツ内のオブジェクトのレイアウトは以下のように指定します。

```css
/**
 * メインコンテンツです。
 * `.l-footer`との下側の余白を指定します。
 * Elementでメインコンテンツ内のレイアウトを指定します。
 * `.l-wrapper__2culumn`を使用することで2カラムレイアウトにすることもできます。
 */
.l-content {
  margin-bottom: 3.2rem;
  & > :last-child {
    margin-bottom: 0;
  }
}

/**
 * メインコンテンツのコンテンツヘッダーです。
 * `.l-content__body`に対して下側の余白を指定します。
 */
.l-content__head {
  margin-bottom: 1.6rem;
  & > :last-child {
    margin-bottom: 0;
  }
}

/**
 * メインコンテンツの本文です。
 */
.l-content__body {
  & > :last-child {
    margin-bottom: 0;
  }
}

/**
 * メインコンテンツのコンテンツフッターです。
 * `.l-content__body`に対して上側の余白を指定します。
 */
.l-content__foot {
  margin-top: 3.2rem;
  & > :last-child {
    margin-bottom: 0;
  }
}

/* 1階層目の`<section>` */
.l-content__firstSection {
  margin-top: 1.6rem;
  margin-bottom: 1.6rem;
  & > :last-child {
    margin-bottom: 0;
  }
}

/* 2階層目の`<section>` */
.l-content__secondSection {
  margin-top: 1.6rem;
  margin-bottom: 1.6rem;
  & > :last-child {
    margin-bottom: 0;
  }
}

/* 3階層目の`<section>` */
.l-content__thirdSection {
  margin-bottom: 1.6rem;
  & > :last-child {
    margin-bottom: 0;
  }
}

/* オブジェクト間のベースになる余白 */
.l-content__item {
  margin-bottom: 1.6rem;
  & > :last-child {
    margin-bottom: 0;
  }
}
```

Layoutオブジェクトは常にルートを基準にサイズを決めるため、`rem`を基本単位とします。

プレフィックス（接頭辞）として`.l-`をつけます。

### 7. Scope
Scopeレイヤーは特定の範囲でのスタイルを定義します。オブジェクト単位ではなく、任意の範囲（スコープ）に対するスタイルを指定します。例えばブログやフッター内であったり、ページやカテゴリなどです。

```css
@import "scope/_blog.css";
```

内包するオブジェクトにも装飾的なスタイルや配置に関する指定をすることもできる影響範囲の大きなレイヤーです。

影響範囲ができるだけ狭くなるように適応する範囲や要素を限定しなければいけません。例えば`.s-scope .c-button--prymary`ではなく、`.c-button--prymary`と`.s-scope__button`のマルチクラスで指定します。

```html
<!-- Allow -->
<div class="s-scope">
  <a class="c-button c-button--prymary" href="#"></a>
</div>

<!-- Good -->
<a class="c-button c-button--prymary s-scope__button" href="#"></a>
```

プレフィックス（接頭辞）として`.s-`をつけます。

### 8. Utility
Utilityレイヤーは汎用クラスを定義します。シングルクラスでも確実にスタイルを適応させるために`!important`を指定することを推奨します。

```css
@import "utility/_align.css";
@import "utility/_text.css";
@import "utility/_display.css";
@import "utility/_col.css";
```

オブジェクトがUtilityオブジェクトで成り立ってしまうことはできるだけ避けます。

Utilityオブジェクトは他のレイヤーが持つよりも汎用的に使えたり、コードが冗長になってしまう場合に使います。pxのような絶対値ではなく、remや%のような相対値を指定することを推奨します。

プレフィックス（接頭辞）として`.u-`をつけます。

### ライブラリ、フレームワーク、プラグイン
CSSのライブラリやフレームワーク、JQueryプラグインのCSSファイルなどを追加する場合も3つの基準にもとづいてカテゴライズします。  
外部のCSSだからといって、役割や機能が変わることはないからです。

例えばnormalize.cssはBaseレイヤー、スライダーのようなJQueryプラグインはProjectレイヤーが適切な場所になります。

CSSファイルは直接編集をせず、librarynameExtend.cssのようなファイルを用意して上書きをします。記述が冗長になってしまう場合は直接編集してもかまいません。

## プレフィックス
レイヤーにカテゴライズしたオブジェクトにはレイヤー名からとったプレフィックスをつけます。

- Component - `.c-`
- Project - `.p-`
- Layout - `.l-`
- Scope - `.s-`
- utility - `.u-`

レイヤーにもとづいたネームスペースで名前の重複を避け、プレフィックスによってオブジェクトの役割を明確にすることができます。

JavaScriptでのみ参照する要素には`js-`プレフィックスをつけます。`js-`プレフィックスのついたクラス名とID名にはCSSを指定することを禁止します。

ライブラリ、フレームワーク、プラグインにはプレフィックスのルールを適応しませんが、独自のプレフィックスをもっているものを使うことを推奨します。

### サフィックス
ブレイクポイントをもっているオブジェクトにはクラス名の末尾にサフィックス（接尾辞）をつけます。  
一貫性をもたせることで機能を明確にすることができます。

ブレイクポイントは`-sp`や`-pc`のようなデバイスを基準とせず、`-sm`や`-lg`のような相対的な名前を使います。

- xs(Extra small)
- sm(Small)
- md(Medium)
- lg(Large)
- xl(Extra large)

## レイヤーの役割
レイヤーには役割を持たせ、装飾と配置、上書きに関するルールを定義します。

### オブジェクト自身の役割
自分自身とはBEMでいうBlockのことです。配置するとは`margin`や`float`、`position`プロパティなどでオブジェクト同士の間隔や位置関係を変更することです。

| レイヤー名   | 自分自身を装飾すること   | 自分自身を配置すること   |
|------------ |------------------------ |------------------------ |
| Base        | 禁止                    | 禁止                    |
| Component   | 可能                    | 禁止                    |
| Project     | 推奨                    | 許容                    |
| Layout      | 許容                    | 推奨                    |
| Scope       | 可能                    | 許容                    |
| Utility     | 許容                    | 禁止                    |


### 内包しているオブジェクトへの影響範囲
内包するオブジェクトとは別のオブジェクトのことです。Blockに対するElementではありません。

| レイヤー名   | 内包するオブジェクトを装飾すること    | 内包するオブジェクトを配置すること    |
|------------ |-------------------------------------- |-------------------------------------- |
| Base        | 禁止                                  | 禁止                                  |
| Component   | 禁止                                  | 禁止                                  |
| Project     | 許容                                  | 推奨                                  |
| Layout      | 許容                                  | 推奨                                  |
| Scope       | 許容                                  | 許容                                  |
| Utility     | 禁止                                  | 禁止                                  |


### 役割と詳細度
| レイヤー名   | 役割                   | 詳細度  |
|------------ |----------------------- |-------- |
| Base        | オブジェクトのベーススタイル       | 低       |
| Component   | 再利用可能で小さなオブジェクト     | 中       |
| Project     | 最終的なユーザーインターフェイス   | 中       |
| Layout      | オブジェクトのレイアウトを決める   | 中       |
| Scope       | 任意の範囲のスタイル              | 中       |
| Utility     | オブジェクトの冗長化を避ける       | 高       |

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
 * tool...Custom SelectorsやCustom Media Queries、@apply Ruleを使ったルールです。
 *
 * BASE
 * normalize...Normalize.cssをインポートしています。
 * base...タイプセレクタと属性セレクタのデフォルトスタイルです。
 *
 * Component
 * icon...アイコンフォントです。テンプレートから自動で生成されます。
 * button...ボタンオブジェクトです。
 *
 * Project
 * listInline...ボタンやラベル、テキストリンクなどを横並びにします。
 * listMark...リストアイテムの左にアイコンを配置します。
 *
 * LAYOUT
 * grid...汎用的なグリッドオブジェクトです。`width`の変更はUtilityレイヤーで指定します。
 * content...コンテンツエリアのレイアウトを指定します。
 *
 * SCOPE
 * blog...ブログエリアのスタイルです。
 *
 * UTILITY
 * align...画像などを左右や中央に配置します。
 * col...レスポンシブに対応した`width`プロパティを指定する汎用クラスです。
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
モジュール化したファイルにはオブジェクトの名前や機能をコメントとして残します。スタイルガイドジェネレーター用のコメントを残してもいいでしょう。

```css
 /* #label
   -------------------------------------------------------------------------- */
.c-label {
  display: inline-block;
  padding: 0.5em;
  color: #fff;
  font-size: 0.8em;
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
