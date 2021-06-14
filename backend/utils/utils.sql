DROP TRIGGER IF EXISTS tr_ai_t_users_coins_movements;
-- end
CREATE TRIGGER tr_ai_t_users_coins_movements
    AFTER INSERT
   ON t_users_coins_movements
BEGIN

    INSERT INTO t_users_coins (
        id_coin,
        id_user,
        amount,
        is_active,
        timestamp_created,
        timestamp_modified
    ) 
    SELECT
    NEW.id_coin,
    NEW.id_user,
    (IFNULL(t1.amount, 0) + (IIF( NEW.id_user_to IS NOT NULL, -1, 1) * NEW.amount)) amount,
    1 is_active,
    NEW.timestamp_created,
    NEW.timestamp_created
    FROM (SELECT 1) t0
    LEFT JOIN t_users_coins t1 ON t1.id_user = NEW.id_user
        AND t1.id_coin = NEW.id_coin
    ON CONFLICT(`id_coin`, `id_user`) DO UPDATE
    SET
    amount = amount + (IIF( NEW.id_user_to IS NOT NULL, -1, 1) * NEW.amount),
    timestamp_modified = NEW.timestamp_created
    ;

END;
-- end
DROP TRIGGER IF EXISTS tr_ai_t_users_coins_movements_2;
-- end
CREATE TRIGGER tr_ai_t_users_coins_movements_2
    AFTER INSERT
   ON t_users_coins_movements
   WHEN NEW.id_user_to IS NOT NULL
BEGIN

    INSERT INTO t_users_coins_movements (
        id_coin,
        id_user,
        id_user_from,
        amount,
        detail_movement,
        timestamp_created,
        timestamp_modified
    ) VALUES (
        NEW.id_coin,
        NEW.id_user_to,
        NEW.id_user,
        NEW.amount,
        NEW.detail_movement,
        NEW.timestamp_created,
        NEW.timestamp_created
    )
    ;

END;