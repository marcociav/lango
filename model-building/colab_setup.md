# Setup Env and Packages

## Using pip

create venv (one time)

```console
python -m venv langomb_venv
```

activate venv

```console
langomb_venv\Scripts\activate.bat
```

install requirements (one time)

```console
pip install -r requirements.txt
```

enable jupyter_http_over_ws (one time)

```console
jupyter serverextension enable --py jupyter_http_over_ws
```

add venv to jupyter (one time)

```console
python -m ipykernel install --user --name=langomb_venv
```

## Run jupyter notebook in Google Colab

execute command:

```console
jupyter notebook --NotebookApp.allow_origin=https://colab.research.google.com --NotebookApp.port_retries=0 --port=8888 --no-browser
```

copy the link from the terminal and paste it into Google Colab -> Connect -> Connect to a local runtime
