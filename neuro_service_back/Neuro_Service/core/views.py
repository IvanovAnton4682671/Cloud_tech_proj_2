from django.views.decorators.csrf import csrf_exempt
import psycopg2
import json
from .utils import *
from django.http import JsonResponse

@csrf_exempt
def authorization(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email", "")
        password = data.get("password", "")

        conn = psycopg2.connect("""
            host=rc1b-n7p3n470tff3pmln.mdb.yandexcloud.net
            port=6432
            sslmode=verify-full
            dbname=users
            user=admin_user
            password=admin_user_users
            target_session_attrs=read-write
        """)
        cur = conn.cursor()
        query = "SELECT * FROM users WHERE email = %s AND password = %s"
        cur.execute(query, (email, password))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user:
            return JsonResponse({"message": "Такой пользователь существует"}, status=200)
        else:
            return JsonResponse({"message": "Такой пользователь не существует"}, status=201)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def registration(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email", "")
        password = data.get("password", "")

        conn = psycopg2.connect("""
            host=rc1b-n7p3n470tff3pmln.mdb.yandexcloud.net
            port=6432
            sslmode=verify-full
            dbname=users
            user=admin_user
            password=admin_user_users
            target_session_attrs=read-write
        """)
        cur = conn.cursor()
        check_query = "SELECT * FROM users WHERE email = %s"
        cur.execute(check_query, (email,))
        existing_user = cur.fetchone()

        if existing_user:
            cur.close()
            conn.close()
            return JsonResponse({"message": "Такой пользователь уже существует"}, status=201)
        else:
            insert_query = "INSERT INTO users (email, password) VALUES (%s, %s)"
            cur.execute(insert_query, (email, password))
            conn.commit()
            cur.close()
            conn.close()
            return JsonResponse({"message": "Пользователь успешно зарегистрировался"}, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def user_message_text(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_message = data.get("message", "")
        response_message = response_message_text(user_message)
        return JsonResponse({"response": response_message}, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def user_message_img(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_message = data.get("message", "")
        response_img = response_message_img(user_message)
        return JsonResponse({"response": response_img}, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def user_message_audio(request):
    if request.method == "POST" and request.FILES.get("audio"):
        user_audio_file = request.FILES["audio"]
        response = response_message_audio(user_audio_file)
        response_text = response.get("text", "")
        return JsonResponse({"response": response_text}, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)
