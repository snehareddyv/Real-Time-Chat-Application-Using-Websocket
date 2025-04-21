from quart import Quart, websocket
from quart_cors import cors
from collections import defaultdict

app = Quart(__name__)
app = cors(app)

rooms = defaultdict(list)

@app.websocket("/ws/<room_id>")
async def ws(room_id):
    ws = websocket._get_current_object()
    rooms[room_id].append(ws)
    try:
        while True:
            msg = await websocket.receive()
            for client in rooms[room_id]:
                if client != ws:
                    await client.send(msg)
    except:
        rooms[room_id].remove(ws)

if __name__ == "__main__":
    app.run(port=8000)
