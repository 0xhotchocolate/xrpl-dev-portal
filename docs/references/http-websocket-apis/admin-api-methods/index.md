---
html: admin-api-methods.html
parent: http-websocket-apis.html
seo:
    description: Administer an XRP Ledger server with these API methods.
labels:
  - Core Server
---
# Admin API Methods

Administer a `rippled` server using these admin API methods. Admin methods are meant only for trusted personnel in charge of keeping the server operational. Admin methods include commands for managing, monitoring, and debugging the server.

Admin commands are available only if you connect to `rippled` on a host and port that the `rippled.cfg` file identifies as admin. By default, the commandline client uses an admin connection. For more information on connecting to `rippled`, see [Getting Started with the `rippled` API](../../../tutorials/http-websocket-apis/get-started.md).


## [Key Generation Methods](key-generation-methods/index.md)

Use these methods to generate and manage keys.

* **[`validation_create`](key-generation-methods/validation_create.md)** - Generate formatted for `rippled` node key pair. (Validators should use [tokens](../../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md) instead of keys generated by this method.)
* **[`wallet_propose`](key-generation-methods/wallet_propose.md)** - Generate keys for a new account.


## [Logging and Data Management Methods](logging-and-data-management-methods/index.md)

Use these methods to manage log levels and other data, such as ledgers.

* **[`can_delete`](logging-and-data-management-methods/can_delete.md)** - Allow online deletion of ledgers up to a specific ledger.
* **[`download_shard`](logging-and-data-management-methods/download_shard.md)** - Download a specific shard of ledger history.
* **[`ledger_cleaner`](logging-and-data-management-methods/ledger_cleaner.md)** - Configure the ledger cleaner service to check for corrupted data.
* **[`ledger_request`](logging-and-data-management-methods/ledger_request.md)** - Query a peer server for a specific ledger version.
* **[`log_level`](logging-and-data-management-methods/log_level.md)** - Get or modify log verbosity.
* **[`logrotate`](logging-and-data-management-methods/logrotate.md)** - Reopen the log file.
* **[`node_to_shard`](logging-and-data-management-methods/node_to_shard.md)** - Copy data from the ledger store to the shard store.


## [Server Control Methods](server-control-methods/index.md)

Use these methods to manage the `rippled` server.

* **[`ledger_accept`](server-control-methods/ledger_accept.md)** - Close and advance the ledger in stand-alone mode.
* **[`stop`](server-control-methods/stop.md)** - Shut down the `rippled` server.

## [Signing Methods](signing-methods/index.md)

Use these methods to sign transactions.

* **[`sign`](signing-methods/sign.md)** - Cryptographically sign a transaction.
* **[`sign_for`](signing-methods/sign_for.md)** - Contribute to a multi-signature.

By default, these methods are [admin-only](../../../tutorials/http-websocket-apis/get-started.md#admin-access). They can be used as public methods if the server admin has [enabled public signing](../../../infrastructure/configuration/enable-public-signing.md).

## [Peer Management Methods](peer-management-methods/index.md)

Use these methods to manage the server's connections in the peer-to-peer XRP Ledger network.

* **[`connect`](peer-management-methods/connect.md)** - Force the `rippled` server to connect to a specific peer.
* **[`peer_reservations_add`](peer-management-methods/peer_reservations_add.md)** - Add or update a reserved slot for a specific peer.
* **[`peer_reservations_del`](peer-management-methods/peer_reservations_del.md)** - Remove a reserved slot for a specific peer.
* **[`peer_reservations_list`](peer-management-methods/peer_reservations_list.md)** - List reserved slots for specific peers.
* **[`peers`](peer-management-methods/peers.md)** - Get information about the peer servers connected.

## [Status and Debugging Methods](status-and-debugging-methods/index.md)

Use these methods to check the status of the network and server.

* **[`consensus_info`](status-and-debugging-methods/consensus_info.md)** - Get information about the state of consensus as it happens.
* **[`feature`](status-and-debugging-methods/feature.md)** - Get information about protocol amendments.
* **[`fetch_info`](status-and-debugging-methods/fetch_info.md)** - Get information about the server's sync with the network.
* **[`get_counts`](status-and-debugging-methods/get_counts.md)** - Get statistics about the server's internals and memory usage.
* **[`manifest`](../public-api-methods/server-info-methods/manifest.md)** - Get the latest public key information about a known validator.
* **[`print`](status-and-debugging-methods/print.md)** - Get information about internal subsystems.
* **[`validator_info`](status-and-debugging-methods/validator_info.md)** - Get information about the server's validator settings, if configured as a validator.
* **[`validator_list_sites`](status-and-debugging-methods/validator_list_sites.md)** - Get information about sites that publish validator lists.
* **[`validators`](status-and-debugging-methods/validators.md)** - Get information about the current validators.


## Deprecated Methods

The following admin commands are deprecated and either have been removed, or may be removed without further notice:

* `ledger_header` - Use the [ledger method][] instead.
* `unl_add`, `unl_delete`, `unl_list`, `unl_load`, `unl_network`, `unl_reset`, `unl_score` - Use the `validators.txt` config file for UNL management instead.
* `wallet_seed` - Use the [wallet_propose method][] instead.
* `validation_seed` - Use the config file and `validator-keys-tool` for managing your seed instead.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
