# Momokarin

2Dボードゲームを作りやすくるためのJSライブラリを目指しています。
現在はトランプなどを遊べるようにしています。
ひと通り落ち着けば抽象化し、ライブラリにしようと考えています。

## Feature

- 重い物理演算を行っていないのでスマートフォンなどでも軽快に動作します


# Setup

```
git clone
npm i
npm run dev
```


# Easy API Document

## VectorObject

ベクトルを持つオブジェクトです。
ベクトルを元に時間ごとの位置座標を計算するための基本的な仕組みを提供します。

## InertiaObject (extend from VectorObject)

タッチやマウスから入力を受け取り、慣性などを提供します。

## InterferenceBase

VectorObjectやInertiaObjectに対して適用するイベントのひな形です。
"干渉"や"妨害"という意味があるので、慣性などを途中で止めたい場合などはこれを継承したオブジェクトで行います。

## NormalizeTouch

タッチやクリックのイベントを統一的に扱うためのクラスです。
まず、このクラスでイベントはフィルタされます。