import asyncio

from app.crud import set_machine_weight, get_all_machines, turn_machine_on, turn_machine_off


def parse_request(request):
    if "showMachines" in request:
        return get_all_machines()
    helper = request.split(' ')
    if "switch" in request:
        if 'on' in request:
            turn_machine_on(int(helper[1]))
        else:
            turn_machine_off(int(helper[1]))
    if "setWeight" in request:
        set_machine_weight(int(helper[1]), int(helper[2][:-1]))


async def tcp_handler(reader, writer):
    request = None
    while request != "quit":
        request = (await reader.read(255)).decode("utf8")
        print(f"request: {request}")
        response = str(parse_request(request))
        print(f"response: {response}")
        writer.write(response.encode('utf8'))
        await writer.drain()
    writer.close()

async def run_server():
    server = await asyncio.start_server(tcp_handler, 'localhost', 3001)
    async with server:
        await server.serve_forever()
