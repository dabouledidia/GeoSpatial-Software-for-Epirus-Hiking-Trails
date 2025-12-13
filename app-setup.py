import os
import subprocess
import sys
import time

DB_HOST = "localhost"
DB_PORT = "5432"
DB_USER = "postgres"
DB_PASS = "enter-your-password"
DB_NAME = "hikingdb"

def print_step(step):
    print(f"\n{step}\n")

def check_command(command, name):
    try:
        subprocess.run([command, "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def create_database():
    print_step(f"Setting up Database: {DB_NAME}")
    try:
        import psycopg2
        from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    except ImportError:
        print("'psycopg2' library missing. Install it with: pip install psycopg2-binary")
        return

    try:

        conn = psycopg2.connect(
            dbname="postgres", user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        exists = cur.fetchone()

        if not exists:
            print(f"Creating database '{DB_NAME}'...")
            cur.execute(f"CREATE DATABASE {DB_NAME}")

        else:
            print(f"Database '{DB_NAME}' already exists.")

        cur.close()
        conn.close()

    except psycopg2.OperationalError as e:
        print(f"Connection failed: {e}")
        print(f"   Ensure PostgreSQL is running and password for user '{DB_USER}' is '{DB_PASS}'.")
    except Exception as e:
        print(f"An error occurred: {e}")

def setup_frontend():
    print_step("Setting up Frontend (Angular)")
    frontend_dir = os.path.join(os.getcwd(), "geospatial-frontend")
    
    if not os.path.exists(frontend_dir):
        print(f"Directory not found: {frontend_dir}")
        return

    print("Running 'npm install' in geospatial-frontend...")
    try:
        subprocess.run(["npm", "install"], cwd=frontend_dir, shell=True, check=True)
        print("Frontend dependencies installed.")
    except subprocess.CalledProcessError:
        print("Failed to install frontend dependencies.")

def check_backend():
    print_step("Checking Backend Prerequisites")

    check_command("java", "Java")

    mvnw_path = os.path.join(os.getcwd(), "geospatial", "mvnw")
    if os.path.exists(mvnw_path):
        if os.name != 'nt': # Unix/Linux/Mac
            os.chmod(mvnw_path, 0o755)
            print("✅ Made 'mvnw' executable.")
    else:
        print("'mvnw' wrapper not found in geospatial directory.")

def main():

    
    # Check Environment
    if not check_command("npm", "Node.js/NPM"):
        print("   Please install Node.js: https://nodejs.org/")
    
    # Database Setup
    create_database()
    
    # Backend Setup
    check_backend()

    # Frontend Setup
    setup_frontend()

    print_step("Setup Complete")


main()