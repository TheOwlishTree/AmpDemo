from utils import fakeDB

db = fakeDB()


def get_all_machines():
    res = ""
    for d in db:
        for v in d.values():
            res += f"{v},"
    return res


def set_machine_weight(machine_id: int, number: int):
    db[machine_id - 1].update({"setWeight": number})


def turn_machine_on(machine_id: int):
    db[machine_id - 1].update({"state": "on"})


def turn_machine_off(machine_id: int):
    db[machine_id - 1].update({"state": "off"})
