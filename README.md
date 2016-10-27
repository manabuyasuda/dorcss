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
BEMはBlock、Element、Modifierという関係性を示すことでコードを理解しやすくします。

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
`.blockName__element--modifier`のように冗長になる場合は`.blockName--modifier > .blockName__element`（0,0,2,0）のように結合子で指定することもできますが、子セレクタを使うなどして範囲をできるだけ限定させます。


JavaScriptを使った動的なスタイルはSMACSSのStateクラスを使います。Stateクラス自体にスタイルを指定することは禁止します。

```css
/* Good */
.blockName.is-active {}
.blockName__element.is-active {}

/* Bad */
.is-active {}
.is-curent {}
``` 

CSSプリプロセッサではネストを使った省略記法が使えますが、（Stateクラスを含む）状態変化やメディアクエリ以外の使用を禁止します。セレクタが常に明確になるように書くことで保守性を維持します。

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
BEMで表現したコンポーネントはモジュールとして1つのファイルにまとめます。Block名とファイル名を同じにすることで、コンポーネントを把握・管理しやすくします（下記はSassを使った場合）。

- `.button` => `_button.scss`
- `.listInline` => `_listInline.scss`

Stateクラスやメディアクエリなど、Blockに関わるスタイルは同じファイル内に保存します。

## レイヤー化
モジュール化したファイルは3つの基準にもとづいてカテゴライズをして、読み込み順を管理します。

- 低詳細度から高詳細度
- 内包される要素から内包する要素
- 抽象的から具体的

```
css
├── Foundation
│   ├── Setting
│   ├── Tool
│   └── Base
├── Object
├── Parts
├── Container
├── Layout
├── Scope
└── Utility
```

ページ特有のスタイルを多く含む場合は、ページ専用のCSSファイルを作ることもできます（下記はSassを使った場合）。

```
root		
├── assets/		
│   └── css/		
│       ├── common.scss		
│       ├── foundation/		
│       │   ├── Setting/		
│       │   ├── Tool/		
│       │   └── Base/		
│       ├── Object/		
│       ├── Parts/		
│       ├── Container/		
│       ├── layout/		
│       ├── Scope/		
│       └── Utility/		
├── css/		
│   └── index.scss		
├── index.html		
└── page/		
    ├── css/		
    │   └── index.scss		
    └── index.html		
```

無理に1つのCSSとして管理するよりスタイルの追加や削除がしやすくなり、common.cssの肥大化・複雑化を防ぐことができます。

### 1. Foundation
FoundationレイヤーではNormalize.cssやリセットCSS、要素セレクタや属性セレクタのようなコンポーネントのベースとなるスタイルを定義します。変数やCSSプリプロセッサを使う場合は関数を定義することもできます。

### 1-1. Setting
Settingレイヤーではグローバルに使用される変数を定義します。例えば、サイトの`max-width`やフォントのサイズ、余白や色に関するものです。

```css		
:root {		
  --max-width: 960px;		
  --brand-color: gold;		
}		
```		
		
```scss		
// scss		
$max-width: 960px !default;		
$brand-color: gold !default;		
}		
```

### 1-2. Tool
ToolレイヤーではSassの@mixinや@function、[Defining Custom Sets of Properties](https://tabatkins.github.io/specs/css-apply-rule/#defining)などを使った関数やカスタムプロパティなどを定義します。

### 1-3. Base
Normalize.cssやリセットCSS、要素セレクタや属性セレクタのようなコンポーネントのベースとなるスタイルを定義します

詳細度はクラスセレクタと同じ0,0,1,0以下になるように極力低くします。メディアクエリや擬似クラスのような、ある状況やある状態に対するスタイルを持つべきではありません。

自分自身の構造を持つことはできますが、装飾と配置、コンポーネントを内包することはできません。

リセットをするよりも継承を利用するようにします。コンポーネント間の余白を管理しやすくするために、上下方向の`margin`は`0`にリセットしておくのを推奨します。

```css		
html {		
  box-sizing: border-box;		
}		
		
*,		
*:before,		
*:after {		
  box-sizing: inherit;		
		
html {		
  font-size: 15px;		
  line-height: 1.6;		
}		
		
body {		
  font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif; 		
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

### 2. Object
プロジェクトを問わず、横断的に再利用できるようなコンポーネントを定義します。OOCSSにおける構造の役割を担当し、装飾的なスタイルを持つことはできません。コンポーネントを内包することもできますが、配置に関する情報だけを持つことができます。

例えば、グリッドシステムやOOCSSのMedia Objectなどが該当します。

Objectコンポーネントをそのまま使うこともできますし、Objectコンポーネントの構造を使って別のコンポーネントを拡張することもできます。ただし、Objectコンポーネントをセレクタにすることは極力避けます。

```html		
<a class="o-button p-buttonPrimary" href="#">ボタン</a>		
```		
		
```css		
/* Good */		
.o-button {}		
.p-buttonPrimary {}		
		
/* Allow */		
.p-buttonPrimary.o-button {}		
```

### 3. Parts
装飾的なスタイルを持つ、再利用できる小さなコンポーネントを定義します。目安としては、見出しやリスト、ボタンやラベルのような他のコンポーネントを内包できない小さなコンポーネントです。内包されるコンポーネントなので配置に関する情報を持つことはできません。

```css		
.p-icon {}		
.p-label {}		
.p-headingH2 {}		
.p-headingH3 {}		
```

### 4. Container
ContainerレイヤーではObjectレイヤーやPartsレイヤーを内包できる比較的大きなコンポーネントを定義します。Containerコンポーネントがユーザーインターフェイスの見た目と構造を確定するので、自分自身と内包するコンポーネントに対して具体的な情報を持つべきです。

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
		
ただし、内包するコンポーネントに直接指定するのではなく、自身のElementに対して指定することを推奨します。役割がより明確になり詳細度を低く保てるからです。		
		
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
		
基本的にはContainerコンポーネント自身の配置を指定することはできませんが、JavaScriptで動的に表示や配置の変更がされるUIの場合は許容されます。例えば、ModalやSticky headerです。

### 5. Layout
Layoutレイヤーはワイヤーフレームに出てくるような大枠のレイアウトを担当するコンポーネントを定義します。Layoutコンポーネントによってページ内のレイアウトが確定します。

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

### 6. Scope
Scopeレイヤーはカテゴリやブログのような特定の範囲でのスタイルを定義します。コンポーネント単位ではなく、任意の範囲（スコープ）に対するスタイルを指定します。

Scopeレイヤー自身も内包するコンポーネントにも装飾的なスタイルや配置に関する指定をすることもできる、影響範囲の大きなレイヤーです。  
影響範囲ができるだけ小さくなるように適応する範囲や要素を限定しなければいけません。

```css		
.s-blog h2 {}		
.s-blog p {}		
.s-blog img {}		
```		
		
```css		
.s-about.o-button {}		
```

### 7. Utility
Utilityレイヤーは汎用クラスを定義します。シングルクラスでも確実にスタイルを適応させるために`!important`を指定することを推奨します。

コンポーネントがUtilityコンポーネントで成り立ってしまうことはできるだけできるだけ避けます。基本的にコンポーネントは自分自身で役割を果たせるように考えるべきです。  
Utilityコンポーネントは他のレイヤーが持つよりも汎用的に使えたり、コードが冗長になってしまう場合に使います。

## プレフィックス
レイヤーにカテゴライズしたコンポーネントにはレイヤー名からとったプレフィックスをつけます。

- Object - `.o-`
- Parts - `.p-`
- Container - `.c-`
- Layout - `.l-`
- Scope - `.s-`
- utility - `.u-`

レイヤーにもとづいたネームスペースで名前の重複を避け、プレフィックスによってコンポーネントの役割を明確にすることができます。

## レイヤーの枠割
レイヤーには役割を持たせ、装飾と配置、上書きに関するルールを定義します。

### コンポーネント自身の役割
自分自身とはBEMでいうBlockのことです。配置するとは`margin`や`float`、`position`プロパティなどでコンポーネント間の間隔や位置関係を変更することです。

| レイヤー名 	| 自分自身を装飾すること 	| 自分自身を配置すること 	|
|------------	|------------------------	|------------------------	|
| Base       	| 禁止                   	| 禁止                   	|
| Object     	| 禁止                   	| 禁止                   	|
| Parts      	| 推奨                   	| 禁止                   	|
| Container  	| 推奨                   	| 許容                   	|
| Layout     	| 禁止                   	| 推奨                   	|
| Scope      	| 許容                   	| 許容                   	|
| Utility    	| 許容                   	| 禁止                   	|


### 内包しているコンポーネントへの影響範囲
内包するコンポーネントとは内包しているコンポーネントとは別のコンポーネントのことです。Blockに対するElementではありません。

| レイヤー名 	| 内包するコンポーネントを装飾すること 	| 内包するコンポーネントを配置すること 	|
|------------	|--------------------------------------	|--------------------------------------	|
| Base       	| 禁止                                 	| 禁止                                 	|
| Object     	| 禁止                                 	| 推奨                                 	|
| Parts      	| 禁止                                 	| 禁止                                 	|
| Container  	| 許容                                 	| 推奨                                 	|
| Layout     	| 禁止                                 	| 推奨                                 	|
| Scope      	| 許容                                 	| 許容                                 	|
| Utility    	| 禁止                                 	| 禁止                                 	|


### 役割と詳細度
| レイヤー名 	| 役割                 	| 詳細度 	|
|------------	|----------------------	|--------	|
| Base       	| グローバル           	| 低     	|
| Object     	| Container・Content 	| 中     	|
| Parts      	| Content           	| 中     	|
| Container  	| Container             	| 中     	|
| Layout     	| Container             	| 中     	|
| Scope      	| 任意の範囲           	| 中     	|
| Utility    	| Content           	| 高     	|
