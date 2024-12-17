import psycopg2

def create_table_users(conn):
    cur = conn.cursor()
    create_table = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    """
    cur.execute(create_table)
    conn.commit()
    cur.close()
    print("Таблица пользователей создана")

def insert_table_users(conn):
    cur = conn.cursor()
    insert_table = """
    INSERT INTO users (email, password)
    VALUES ('anton-ivanov-080203@mail.ru', '4682671')
    """
    cur.execute(insert_table)
    conn.commit()
    cur.close()
    print("Пользователи были добавлены")

if __name__ == "__main__":
    conn = psycopg2.connect("""
        host=rc1b-n7p3n470tff3pmln.mdb.yandexcloud.net
        port=6432
        sslmode=verify-full
        dbname=users
        user=admin_user
        password=admin_user_users
        target_session_attrs=read-write
    """)
    print("Соединение с базой установленно")
    #create_table_users(conn)
    #insert_table_users(conn)
    conn.close()
    print("Соединение с базой разорвано")