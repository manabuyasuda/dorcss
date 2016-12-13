# DORCSS(division of roles CSS)

DORCSS（ドールシーエスエス）はRole（役割）を分担・分割（Division）することで影響範囲を管理するCSS設計の構成案です。

[OOCSS](https://github.com/stubbornella/oocss)、[SMACSS](https://smacss.com/ja)、[BEM](https://en.bem.info/)、[FLOCSS](https://github.com/hiloki/flocss)、[ITCSS](https://speakerdeck.com/dafed/managing-css-projects-with-itcss)、[Atomic Desing](http://atomicdesign.bradfrost.com/)、[large-scale-javascript](https://github.com/azu/large-scale-javascript)に強く影響を受けています。

DORCSSでは以下のような用語を使います。

- コンポーネント - 役割をもった部品
- モジュール - コンポーネントをファイル化したもの
- レイヤー - モジュールをカテゴライズした状態
- 装飾 - `color`や`background-color`のような見た目に関すること
- 構造 - `display`や`padding`のような骨格に関すること
- 配置 - `margin`や`position`などのレイアウトに関すること

## DORCSSの基本

### 継承
コンポーネントはハードコード（ある状態でだけ正しくふるまうこと）をできるだけ避けるべきです。規模の大きなWebサイトでは1つのデザイン変更で多くのコンポーネントに修正が必要になってしまう恐れがあるからです。

CSSには継承という仕組みがあります。ルート要素にベースとなるスタイルを指定してコンポーネントが継承して利用できるようにします。変数や@apply ruleを併用して一括で管理できるのが理想的です。また、サイズの単位はpxをなるべく避け、remやemをベースにします。

### 名前の衝突と役割の明確化
CSSには機能的にスコープを作ることはできないので、名前によって擬似的にスコープを作る必要があります。名前の重複を避けることができれば、スタイルの意図しない衝突を起こす可能性が下がります。
名前でスコープを作るために4つの方法を利用します。

1. MindBEMdingの命名規則をベースとすることでコンポーネント名の衝突を防ぐこと
2. BEMのBlockごとにファイルを分割（モジュール化）することでファイル単位での管理をすること
3. コンポーネントの役割ごとにレイヤーを定義しフォルダに分けることでディレクトリ単位での管理をすること
4. コンポーネントの役割ごとにプレフィックス（ネームスペース）をつけること

### 見た目を表す名前
コンポーネントの名前と役割は一致することが望ましいです。コンポーネントの見た目は変更される可能性がありますが、役割が変わることはないからです。コンポーネント名が見た目を表していた場合、見た目の変更は大幅なHTMLの修正につながってしまいます。

見た目を表すコンポーネント名にするときは変数や@apply Ruleなどで抽象化をして使うようにします。

### 詳細度と読み込み順
スタイルが期待通りに適応されるようにするために3つの方法を利用します。

1. 結合子をもたないクラスの指定をベースにして詳細度をできるだけ低く保つこと
2. スタイルシートの序盤はできるだけ詳細度を低く、徐々に高くすること
3. 優先的に適応したいコンポーネントほどスタイルシートの後半で指定すること

### コンポーネントの拡張性
コンポーネントは拡張を前提として考えます。コンポーネントはベースとなる構造を持ち、バリエーションはBEMのModifierやSMACSSのStateで拡張します。

### コンポーネント同士の関係性
あるコンポーネント内のカスケーディング（例えばバリエーション違いでスタイルを上書きすることなど）に制限はありません。カスケーディングが問題になるのはコンポーネント同士のカスケーディングです。

コンポーネントは**上書きされるオブジェクト**と**上書きするオブジェクト**を区別することで関係性を明確にします。コンポーネント同士の方向性を一致させることでスタイルの衝突を防ぎます。上書きされるコンポーネントは上書きに適したスタイルの指定をする必要があります。

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
├── Setting/
├── Tool/
├── Base/
├── Atoms/
├── Molecules/
├── Organisms/
├── Templates/
├── Pages/
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
│       ├── Atoms/
│       ├── Molecules/
│       ├── Organisms/
│       ├── Templates/
│       ├── Pages/
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

### 4. Atoms
Atoms（アトム）は機能的にこれ以上分割ができない最小の要素です。例えば、見出しやリスト、フォームラベルやボタンなどが該当します。

Atomic DesignにおけるAtomsは抽象的で目的をもたないものとされますが、役割をもった具体的なUIにすることも許容します。つまりAtoms単体で機能を拡張することもできます。カラーパレットやアニメーションもAtomsとされていますが、SettingとToolに定義します。

後述するMoleculesとOrganismsのスタイルを継承できるように`em`での指定を基本とします。

配置に関する情報は持つことができないので、Atoms単体で使う場合はTemplatesとセットになります。  
プレフィックス（接頭辞）として`.a-`をつけます。

```css
@import "atoms/_icon.css";
@import "atoms/_iconExtend.css";
@import "atoms/_label.css";
@import "atoms/_button.css";
@import "atoms/_embed.css";
@import "atoms/_list.css";
@import "atoms/_title.css";
@import "atoms/_heading2.css";
@import "atoms/_heading3.css";
@import "atoms/_lead.css";
@import "atoms/_delimiter.css";
@import "atoms/_input.css";
@import "atoms/_textarea.css";
@import "atoms/_select.css";
@import "atoms/_inputCheckbox.css";
@import "atoms/_inputRadio.css";
```

### 5. Molecules
Molecules（モルキュール）はAtomsを組み合わせた比較的シンプルなUIグループです。例えば、検索フォームはlabelとinput、buttonが組み合わさったMoleculesです。

Moleculesはシンプルで機能的・意味的なコンポーネントにすることを推奨します。これにより、扱いやすく、メンテナンス性が高く、一貫性を保ったUIにすることができます。

後述するOrganismsのスタイルを継承できるように`em`での指定を基本とします。  
プレフィックス（接頭辞）として`.m-`をつけます。

```css
@import "molecules/_listInline.css";
@import "molecules/_listMark.css";
@import "molecules/_figure.css";
@import "molecules/_ratio.css";
@import "molecules/_block.css";
@import "molecules/_table.css";
@import "molecules/_media.css";
@import "molecules/_flag.css";
@import "molecules/_breadcrumb.css";
```

### 6. Organisms
Organisms（オルガニズム）はAtomsやMolecules、または複数のMoleculesを組み合わせた比較的複雑なUIグループです。例えば、グローバルヘッダーはロゴとグローバルナビゲーション、検索フォームなどが組み合わさったOrganismsです。  
プレフィックス（接頭辞）として`.o-`をつけます。

```css
@import "organisms/";
```

### 7. Templates
Templates（テンプレート）はページレベルのオブジェクトで、コンポーネント（Atoms・Molecules・Organisms）を配置してページの構成を整えます。

ワイヤーフレームのような大きなレイアウトから、コンポーネント単位のレイアウトまで様々です。コンポーネントにダミーのテキストや画像を挿入することで、コンテンツの量や大きさによって意図しないデザインになってしまわないかをテストすることができます。  
プレフィックス（接頭辞）として`.t-`をつけます。

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

Templatesのバリエーションを定義することもできます。例えば、特定のページやカテゴリに対するスタイルを定義したり、動的にページの状態を変更したいときなどです。  
プレフィックス（接頭辞）として`.p-`をつけます。

```css
@import "pages/_blog.css";
```

### 9. Utility
Utilityレイヤーは汎用クラスを定義します。シングルクラスでも確実にスタイルを適応させるために`!important`を指定することを推奨します。

コンポーネントがUtilityコンポーネントで成り立ってしまうことはできるだけ避けます。Utilityコンポーネントは他のレイヤーが持つよりも汎用的に使えたり、コードが冗長になってしまう場合に使います。

pxのような絶対値ではなく、remや%のような相対値を指定することを推奨します。  
プレフィックス（接頭辞）として`.u-`をつけます。

```css
@import "utility/_align.css";
@import "utility/_text.css";
@import "utility/_display.css";
@import "utility/_col.css";
```

### ライブラリ、フレームワーク、プラグイン
CSSのライブラリやフレームワーク、JQueryプラグインのCSSファイルなどを追加する場合も3つの基準にもとづいてカテゴライズします。  
外部のCSSだからといって、役割や機能が変わることはないからです。

例えばnormalize.cssはBaseレイヤー、スライダーのようなJQueryプラグインはOrganismsレイヤーが適切な場所になります。

CSSファイルは直接編集をせず、librarynameExtend.cssのようなファイルを用意して上書きをします。記述が冗長になってしまう場合は直接編集してもかまいません。

## プレフィックス
レイヤーにカテゴライズしたオブジェクトにはレイヤー名からとったプレフィックスをつけます。

- Atoms - `.a-`
- Molecules - `.m-`
- Organisms - `.o-`
- Templates - `.t-`
- Pages - `.p-`
- utility - `.u-`

レイヤーにもとづいたネームスペースで名前の重複を避け、プレフィックスによってオブジェクトの役割を明確にすることができます。

JavaScriptでのみ参照する要素には`js-`プレフィックスをつけます。`js-`プレフィックスのついたクラス名とID名にはCSSを指定することを禁止します。

ライブラリ、フレームワーク、プラグインにはプレフィックスのルールを適応しませんが、独自のプレフィックスをもっているものを使うことを推奨します。

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
 * tool...Custom SelectorsやCustom Media Queries、@apply Ruleを使ったルールです。
 *
 * BASE
 * normalize...Normalize.cssをインポートしています。
 * base...タイプセレクタと属性セレクタのデフォルトスタイルです。
 *
 * ATOMS
 * icon...アイコンフォントです。テンプレートから自動で生成されます。
 * iconExtend...アイコンにスタイルを追加します。
 *
 * MOLECULES
 * listInline...ボタンやラベル、テキストリンクなどを横並びにします。
 * listMark...リストアイテムの左にアイコンを配置します。
 *
 * ORGANISMS
 *
 * TEMPLATE
 * grid...汎用的なグリッドオブジェクトです。`width`の変更はUtilityレイヤーで指定します。
 * header...グローバルヘッダーのレイアウトを指定します。
 *
 * PAGE
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
  border-radius: var(--border-radius);
  color: inherit;
  font-family: inherit;
  font-size: 1em;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  background: transparent;
  cursor: pointer;
  appearance: none;
  &:--onEvent {
    text-decoration: none;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.a-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}

.a-button--full {
  width: 100%;
}

.a-button--primary {}
.a-button--secondary {}
.a-button--tertiary {}
.a-button--quaternary {}
```

### 注意事項とTODO
あとで処理をしたいことや、把握しておいてほしい注意事項はコメントに残していつでも検索できるようにします。

- `NOTE:` コード上で確認できない制限などの共有
- `TBD:` 今後どうしていくか検討したいこと
- `TODO:` 動作はするけれど改修したい箇所
