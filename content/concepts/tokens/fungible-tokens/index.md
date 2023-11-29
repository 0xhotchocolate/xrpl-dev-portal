---
html: fungible-tokens.html
parent: tokens.html
blurb: Learn about the properties and rationale of trust lines.
labels:
  - Tokens
---
# Fungible Tokens

Anyone can issue fungible tokens on the XRP Ledger, ranging from informal "IOUs" to fiat-backed stablecoins, purely digital fungible and semi-fungible tokens, and more. 

Fungible tokens are interchangeable and indistinguishable from one another. They can be swapped and substituted for other tokens of equivalent value. 

> Fun·gi·ble /´fənjəbəl/ (adj) <!-- SPELLING_IGNORE: fənjəbəl -->
>
> 1. able to replace or be replaced by another identical item; mutually interchangeable. <!-- STYLE_OVERRIDE: identical -->

A good example of a fungible item might be a postage stamp. If you're standing around in 1919 and need to send a letter by airmail, you would buy a 24-cent stamp and affix it to your envelope. If you lost that stamp, you could use a different 24-cent stamp or use 2 10-cent stamps and 2 2-cent stamps. Very fungible.

![Jenny Stamps](img/nft-concepts1.png "Jenny Stamps")

But since you are standing around in 1919, you might be offered 24-cent airmail stamps where the aeroplane on the stamp is accidentally printed upside down. These are the world famous “Inverted Jenny” stamps. Only 100 were circulated on a single sheet of stamps, making them extremely rare and sought after. The current value of each mint condition stamp is appraised at over 1.5 million US dollars.

![Inverted Jenny Stamps](img/nft-concepts2.png "Inverted Jenny Stamps")

Those stamps cannot be replaced by an ordinary 24-cent stamp. They have become _non-fungible_.

The steps to issue a fungible token are not complicated. You determine the name for the token, create a _trust line_ between an issuing account and a consuming account, then send fungible tokens from the issuing account to the consuming account.

## Trust Lines

Trust lines are structures in the XRP Ledger for holding [tokens](tokens.html). Trust lines enforce the XRP Ledger's rule that you cannot cause someone else to hold a token they don't want. This precaution is necessary to enable the XRP Ledger's use case for [community credit](tokens.html#community-credit) among other benefits.

Each "trust line" is a _bidirectional_ relationship consisting of:

- The identifiers for the two [accounts](accounts.html) that the trust line connects.
- A single, shared balance, which is positive from the perspective of one account and negative from the other perspective.
    - The account with a negative balance is generally considered the "issuer" of the tokens. However, in the [APIs](http-websocket-apis.html), the name `issuer` can refer to either side.
- Various settings and metadata. _Each_ of the two accounts can control its own settings on the trust line.
    - Most importantly, each side sets a limit on the trust line, which is 0 by default. Each account's balance (from its perspective on the trust line) can't go above that account's limit, except [through that account's own actions](#going-above-the-limit).

Each trust line is specific to a given [currency code][]. Two accounts can have any number of trust lines between them for different currency codes, but only one shared trust line for any particular currency code.

The balance on a trust line is negative or positive depending on which side you view it from. The side with the negative balance is called the "issuer" and can control some properties of how those tokens behave. When you send tokens to another account that isn't the issuer, those tokens "ripple" through the issuer and possibly other accounts using the same currency code. This is useful in some cases, but can cause unexpected and undesirable behavior in others. You can use the [No Ripple flag](rippling.html) on trust lines to prevent those trust lines from rippling.

## Creation

Any account can unilaterally "trust" another account to issue a token by sending a [TrustSet transaction][] with a nonzero limit and their own settings. This creates a line with a zero balance, and sets the other side's settings to the default.

Trust lines can be implicitly created by some transactions, such as when you buy a token in the [decentralized exchange](decentralized-exchange.html). In this case, the trust line uses entirely default settings.


## Going Above the Limit

There are three cases where you can hold a balance that is _greater_ than your limit on that trust line:

1. When you acquire more of that token through [trading](decentralized-exchange.html).
2. When you decrease the limit on a trust line that has a positive balance.
3. When you acquire more of that token by [cashing a Check](checks.html). (_Requires the [CheckCashMakesTrustLine amendment][]_)


## Trust Line Settings

In addition to the shared balance, each account has its own settings on the trust line, which consist of the following:

- The **Limit**, a number from 0 to the [maximum token amount](currency-formats.html). Payments and other accounts' actions cannot cause the trust line's balance (from this account's perspective) to go over the limit. The default is `0`.
- **Authorized**: A true/false value used with [Authorized Trust Lines](authorized-trust-lines.html) to allow the other side to hold tokens this account issues. The default is `false`. Once set to `true`, this cannot be changed back.
- **No Ripple**: A true/false value to control whether tokens can [ripple](rippling.html) through this trust line. The default depends on the account's "Default Ripple" setting; for new accounts, "Default Ripple" is off which means that `true` is the default for No Ripple. Usually, issuers should allow rippling and non-issuers should disable rippling unless they are using trust lines for community credit.
- **Freeze**: A true/false value indicating whether an [individual freeze](freezes.html#individual-freeze) is in effect on this trust line. The default is `false`.
- **Quality In** and **Quality Out** settings, which allow the account to value tokens issued by the other account on this trust line at less (or more) than face value. For example, if a stablecoin issuer charges a 3% fee for withdrawing tokens for the equivalent off-ledger assets, you could use these settings to value those tokens at 97% of face value. The default, `0`, represents face value.


## Reserves and Deletion

Since a trust line occupies space in the ledger, [a trust line increases the XRP your account must hold in reserve](reserves.html). Either or both accounts in the trust line may be charged the reserve for the trust line, depending on the status of the trust line: if any of your settings are not the default, or if you hold a positive balance, it counts as one item toward your owner reserve.

Generally, this means that the account that created the trust line is responsible for the reserve and the issuer is not. <!-- STYLE_OVERRIDE: is responsible for -->

Trust lines are automatically deleted if both sides' settings are in the default state and the balance is 0. This means that, to delete a trust line, you need to:

1. Send a [TrustSet transaction][] to set your settings to the defaults.
2. Offload any positive balance you have on the trust line. You could do this by sending a [payment](cross-currency-payments.html), or by selling the currency in the [decentralized exchange](decentralized-exchange.html).

If your balance is negative (you are the issuer) or the other side's settings are not in the default state, you cannot cause the trust line to be totally deleted, but you can make it so that it does not count towards your owner reserve by following the same steps.

Since the **Authorized** setting cannot be turned off after it has been turned on, it does not count toward the trust line's default state.

### Free Trust Lines
[[Source]](https://github.com/XRPLF/rippled/blob/72377e7bf25c4eaee5174186d2db3c6b4210946f/src/ripple/app/tx/impl/SetTrust.cpp#L148-L168)

Since trust lines are a powerful feature of the XRP Ledger, there is a special feature to make an account's first two trust lines "free".

When an account creates a new trust line, if the account owns at most 2 items in the ledger including the new line, the account's owner reserve is treated as zero instead of the normal amount. This allows the transaction to succeed even if the account does not hold enough XRP to meet the increased reserve requirement for owning objects in the ledger.

When an account owns 3 or more objects in the ledger, the full owner reserve applies.


## See Also

- **Concepts:**
    - [Decentralized Exchange](decentralized-exchange.html)
    - [Rippling](rippling.html)
- **References:**
    - [account_lines method][] - Look up trust lines attached to a given account
    - [gateway_balances method][] - Look up an issuer's total balance issued
    - [RippleState object](ripplestate.html) - The data format for trust lines in the ledger's state data.
    - [TrustSet transaction][] - The transaction to create or modify trust lines.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
