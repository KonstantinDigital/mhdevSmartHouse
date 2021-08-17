FROM python:3.9.5
ENV PYTHONUNBUFFERED 1
RUN mkdir /app
WORKDIR /app
ADD requirements.txt /app/
RUN pip install -r requirements.txt
ADD . /app/
EXPOSE 8000
ENV TZ Europe/Moscow
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
