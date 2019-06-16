# Configure application

import os
import flask


from flask import Flask, flash, jsonify, json, redirect, render_template, request, session
from flask_mysqldb import MySQL
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import apology, login_required
from datetime import date, datetime, timedelta
import locale
import MySQLdb
from MySQLdb import escape_string as thwart


app = Flask(__name__)


# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Define mysql connection function
def connection():
    conn = MySQLdb.connect(host="127.0.0.1", user = "test", passwd = "123", db = "database")
    c = conn.cursor()
    return c, conn

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    return apology("TODO")

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        #rows = ("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))

        c, conn = connection()
        uname = str(request.form.get("username"))
        #debugging and pwhash workaround
        pwhash = generate_password_hash(request.form.get("password"))
        print(pwhash)
        c.execute("UPDATE `users` SET pwhash = (%s) WHERE uname = (%s)", [pwhash, thwart(uname)])
        rows = c.execute("SELECT * FROM users WHERE uname = (%s)", [thwart(uname)])
        rows = c.fetchone()
        print("pwhash: ", [rows[2]])
        print("pwhash: ", [rows])
        # Ensure username exists and password is correct
        if not rows or not check_password_hash(rows[2], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]
        print(session)
        # Redirect user to home page
        return redirect("/")
    
    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")

@app.route("/date")
@login_required
def holdatum():
    deit = locale.getlocale()
    locale.setlocale(locale.LC_TIME, deit)
    #print(deit)
    wochennummer = date.today().isocalendar()[1]
    #heute = datetime.now()
    heute = date.today()
    heuteout = heute.strftime("%d. %B %Y")
    start_of_week = heute - timedelta(days=heute.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    wosta = start_of_week.strftime("%d. %B %Y")
    woend = end_of_week.strftime("%d. %B %Y")
    jsonStr = {'Wochennummer' : wochennummer}
    jsonStr.update( {'Heute' : heuteout} )
    jsonStr.update( {'Wochenstart' : wosta} )
    jsonStr.update( {'Wochenend' : woend} )
    return jsonify(jsonStr)


@app.route("/t")
def usert():
    c, conn = connection()
    uname = str(request.form.get("username"))
    #rows = c.execute("SELECT * FROM users WHERE uname = (%s)", uname)
    #rows = c.fetchone()
    print(uname)

@app.route("/u")
@login_required
def rendertables():
    #calculate values for table generator (cells in one row have 24 hours difference, html table built row by row)
    #values for 24 rows in 7 columns 
    cols = []
    for gre in range (1, 25):
        irg = gre
        cells = []
        cells.append(irg)
        for ref in range (0, 7):
            irg += 24
            cells.append(irg)
        cols.append(cells)
    #calculate start and end dates of current week
    heute = date.today()
    start_of_week = heute - timedelta(days=heute.weekday())  # Monday
    end_of_week = start_of_week + timedelta(days=6)
    wosta = start_of_week.strftime("%d.%m.%Y")
    woend = end_of_week.strftime("%d.%m.%Y")
    wochennummer = date.today().isocalendar()[1]
    print(session)

    return render_template("tables.html", cols=cols, wosta=wosta, woend=woend, wochennummer=wochennummer)

@app.route("/res")
@login_required
def sendres():
    c, conn = connection()
    res = {}
    #res_self = c.execute("SELECT feld FROM reservation WHERE user = (%s)", [session["user_id"]])
    #res_self = c.fetchall()
    #res.update( { 'self' : res_self } )
    #print(res)
    res_and = c.execute("SELECT * FROM reservation")
    res_and = c.fetchall()
    print(res_and)
    for el in res_and:
        if el[0] == str(session["user_id"]):
            key = "self"
            res.setdefault(key, [])
            res["self"].append(el[1])
        else:
            key = el[0]
            res.setdefault(key, [])
            res[el[0]].append(el[1])
    print(res)
    return jsonify(res)

if __name__ == '__main__':
    app.run(debug=True)

