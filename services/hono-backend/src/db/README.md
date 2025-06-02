# Заметки

## Интересные моменты

### Нотификации при генерации миграций

```bash
$ npx drizzle-kit push

No config path provided, using default 'drizzle.config.ts'
Reading config file '/Users/mioe/git-yourgood/shared/billing/hono-backend/drizzle.config.ts'
Using 'postgres' driver for database querying
[✓] Pulling schema from database...
{
  severity_local: 'NOTICE',
  severity: 'NOTICE',
  code: '42622',
  message: 'identifier "payment_detail_channel_slot_company_channel_slot_id_company_channel_slot_id_fk" will be truncated to "payment_detail_channel_slot_company_channel_slot_id_company_cha"',
  file: 'scansup.c',
  line: '99',
  routine: 'truncate_identifier'
}
{
  severity_local: 'NOTICE',
  severity: 'NOTICE',
  code: '42622',
  message: 'identifier "payment_detail_rate_feature_company_rate_feature_id_company_rate_feature_id_fk" will be truncated to "payment_detail_rate_feature_company_rate_feature_id_company_rat"',
  file: 'scansup.c',
  line: '99',
  routine: 'truncate_identifier'
}
{
  severity_local: 'NOTICE',
  severity: 'NOTICE',
  code: '42622',
  message: 'identifier "payment_detail_waba_wallet_company_waba_wallet_id_company_waba_wallet_id_fk" will be truncated to "payment_detail_waba_wallet_company_waba_wallet_id_company_waba_"',
  file: 'scansup.c',
  line: '99',
  routine: 'truncate_identifier'
}
[✓] Changes applied
```

Это сообщения от PostgreSQL о том, что имена ограничений внешних ключей (foreign key constraints) превышают максимальную длину идентификатора в PostgreSQL и будут обрезаны.
В PostgreSQL максимальная длина идентификатора составляет 63 символа. Когда Drizzle автоматически генерирует имена для constraints, они могут получиться слишком длинными из-за длинных имен таблиц и колонок.

Что происходит:
payment*detail_channel_slot_company_channel_slot_id_company_channel_slot_id_fk → обрезается до payment_detail_channel_slot_company_channel_slot_id_company_cha
payment_detail_rate_feature_company_rate_feature_id_company_rate_feature_id_fk → обрезается до payment_detail_rate_feature_company_rate_feature_id_company_rat
payment_detail_waba_wallet_company_waba_wallet_id_company_waba_wallet_id_fk → обрезается до payment_detail_waba_wallet_company_waba_wallet_id_company_waba*

Это проблема?
Функционально - нет, constraint'ы работают нормально
Потенциально может создать проблемы, если вы полагаетесь на полные имена constraint'ов в коде

PS поправил через ручную установку имен constraint'ов в файлах:

- schema/payment-detail-channel-slot.ts
- schema/payment-detail-rate-feature.ts
- schema/payment-detail-waba-wallet.ts
