import Queue from '../src/Queue.ts';
import {IQueue} from '../src/IQueue.ts';

describe('queue tests', () => {
	var queue: IQueue<number>;

	beforeEach(() => {
		queue = new Queue<number>();
	});

	it("Корректно устанавливаться размер и отдается", () => {
		var size = 5;
		
		queue.setSize(size);
		expect(queue.getSize()).toEqual(size);

		queue.setSize(size * 2);
		expect(queue.getSize()).not.toEqual(size);
    });

	it("Корректно устанавливаться общее количество и отдается", () => {
		var count = 3;

		queue.setCount(count);
		expect(queue.getCount()).toEqual(count);

		queue.setCount(count * 2);
		expect(queue.getSize()).not.toEqual(count);
	});

	it("Выдаст ошибку на попытку записать кусок не указав размер", () => {
		var piece = [1, 2, 3];

		expect(() => queue.setPiece(piece)).toThrowError();
	});

	it("Сначала указать размер, потом записать кусок", () => {
		var piece = [1, 2, 3],
			size = 5;

		queue.setSize(size);
		expect(() => queue.setPiece(piece)).not.toThrowError();
	});

	it("Если длина больше размера очереди - ошибка", () => {
		var piece = [1, 2, 3],
			size = 2;

		queue.setSize(size);
		expect(() => queue.setPiece(piece)).toThrowError();
	});

	it("Если кусок пустой - ошибка", () => {
		var piece = [],
			size = 2;

		queue.setSize(size);
		expect(() => queue.setPiece(piece)).toThrowError();
	});

	it("Если запись куска прошла успешно вернет записанный кусок, как текущий", () => {
		var piece = [1, 2, 3, 4, 5],
			size = 5;

		queue.setSize(size);
		queue.setPiece(piece);

		expect(queue.getActual()).toEqual(piece);
	});

	it("При второй записи, вернет первый кусок как текущий, а второй кусок как следующий", () => {
		var piece_1 = [1, 2, 3, 4, 5],
			piece_2 = [10, 20, 30],
			size = 5;

		queue.setSize(size);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);

		expect(queue.getActual()).toEqual(piece_1);
		expect(queue.getNext()).toEqual(piece_2);
	});

	it("При третьей записи, вернет первый кусок как предидущий, второй кусок как текущий, а третий как следующий", () => {
		var piece_1 = [1, 2, 3, 4, 5],
			piece_2 = [10, 20, 30],
			piece_3 = [10, 20, 30, 40],
			size = 5;

		queue.setSize(size);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);
		queue.setPiece(piece_3);

		expect(queue.getPrev()).toEqual(piece_1);
		expect(queue.getActual()).toEqual(piece_2);
		expect(queue.getNext()).toEqual(piece_3);
	});

	it("При больше трех записей, куски приходят и уходят в порядке очереди: первый пришел первый ушел", () => {
		var piece_1 = [1, 2, 3, 4, 5],
			piece_2 = [10, 20, 30],
			piece_3 = [10, 20, 30, 40],
			piece_4 = [10, 20, 30, 40, 8],
			size = 5;

		queue.setSize(size);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);
		queue.setPiece(piece_3);
		queue.setPiece(piece_4);

		expect(queue.getPrev()).toEqual(piece_2);
		expect(queue.getActual()).toEqual(piece_3);
		expect(queue.getNext()).toEqual(piece_4);
	});


	it("Должен возвращать текущий диапозон от и до, в состоянии actual", () => {
		var piece_1 = [1, 2, 3, 4, 5],
			piece_2 = [10, 20, 30],
			piece_3 = [10, 20, 30, 40],
			from = piece_1.length + 1,
			to = from + piece_2.length - 1,
			size = 5;

		queue.setSize(size);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);
		queue.setPiece(piece_3);

		expect(queue.getActualRange()).toEqual({from, to});
	});

	it("Должен возвращать текущий диапозон от и до, в состоянии actual, вариант посложней", () => {
		var piece_1 = [1, 2, 3, 4, 5],
			piece_2 = [10, 20, 30],
			piece_3 = [10, 20, 30, 40],
			piece_4 = [10, 20, 30, 40, 8],
			from = piece_1.length + piece_2.length + 1,
			to = from + piece_3.length - 1,
			size = 5;

		queue.setSize(size);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);
		queue.setPiece(piece_3);
		queue.setPiece(piece_4);

		expect(queue.getActualRange()).toEqual({from, to});
	});

	it("Если установить общий размер count, и записать меньше объектов, должен показывать что в очереди есть место", () => {
		var piece_1 = [1, 2, 3, 4, 5],
			piece_2 = [10, 20, 30],
			piece_3 = [10, 20, 30, 40],
			count = 20,
			size = 5;

		queue.setSize(size);
		queue.setCount(count);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);
		queue.setPiece(piece_3);

		expect(queue.isEnough()).toBeFalsy();
	});


	it("Если установить общий размер count, и записать больше или ровно столько же объектов, должен показывать что в очереди нет мест", () => {
		var piece_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			piece_2 = [10, 20, 30, 40, 50],
			count = 15,
			size = 10;

		queue.setSize(size);
		queue.setCount(count);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);
		
		expect(queue.isEnough()).toBeTruthy();
	});

	it("Если установить общий размер count, вернет число доступных мест в очереди", () => {
		var piece_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			piece_2 = [10, 20],
			count = 15,
			size = 10;

		queue.setSize(size);
		queue.setCount(count);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);

		expect(queue.getAvailability()).toEqual(count - piece_1.length - piece_2.length);
	});

	it("Передвигает указатели prev и actual если есть next. Возвращает prev. Правильно рассчитывает range.", () => {
		var piece_1 = [1, 2, 3, 4, 5],
			piece_2 = [10, 20, 30],
			piece_3 = [10, 20, 30, 40],
			piece_after = [1111],
			from = piece_1.length + piece_2.length + 1,
			to = from + piece_3.length - 1,
			size = 5;

		queue.setSize(size);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);
		queue.setPiece(piece_3);

		expect(queue.moveForward()).toEqual(piece_1);
		expect(queue.getPrev()).toEqual(piece_2);
		expect(queue.getActual()).toEqual(piece_3);
		expect(queue.getNext()).toEqual([]);
		expect(queue.getActualRange()).toEqual({from, to});

		queue.setPiece(piece_after);

		expect(queue.getPrev()).toEqual(piece_2);
		expect(queue.getActual()).toEqual(piece_3);
		expect(queue.getNext()).toEqual(piece_after);

		queue.setPiece(piece_after);

		expect(queue.getPrev()).toEqual(piece_3);
		expect(queue.getActual()).toEqual(piece_after);
		expect(queue.getNext()).toEqual(piece_after);
	});

	it("Передвигает указатели actual и next если есть prev. Возвращает next. Правильно рассчитывает range.", () => {
		var piece_1 = [1, 2, 3, 4, 5, 6, 7, 8],
			piece_2 = [10, 20],
			piece_3 = [10, 20, 30, 40],
			piece_after = [1111],
			from = 1,
			to = piece_1.length,
			size = 10;

		queue.setSize(size);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);
		queue.setPiece(piece_3);

		expect(queue.moveBack()).toEqual(piece_3);
		expect(queue.getPrev()).toEqual([]);
		expect(queue.getActual()).toEqual(piece_1);
		expect(queue.getNext()).toEqual(piece_2);
		expect(queue.getActualRange()).toEqual({from, to});

		queue.setPiece(piece_after);

		expect(queue.getPrev()).toEqual(piece_1);
		expect(queue.getActual()).toEqual(piece_2);
		expect(queue.getNext()).toEqual(piece_after);

		queue.setPiece(piece_after);

		expect(queue.getPrev()).toEqual(piece_2);
		expect(queue.getActual()).toEqual(piece_after);
		expect(queue.getNext()).toEqual(piece_after);
	});

	it("Если prev пустой то позволяет записать кусок", () => {
		var piece_1 = [1, 2, 3, 4, 5, 6, 7, 8],
			piece_2 = [10, 20],
			piece_3 = [10, 20, 30, 40],
			piece_4 = [10, 20, 30, 40, 15, 23],
			piece_after = [1111],
			from = piece_1.length + piece_2.length + 1,
			to = from + piece_3.length - 1,
			size = 10;

		queue.setSize(size);
		queue.setPiece(piece_1);
		queue.setPiece(piece_2);
		queue.setPiece(piece_3);
		queue.setPiece(piece_4);

		queue.moveBack();

		queue.setPrevPiece(piece_after);

		expect(queue.getPrev()).toEqual(piece_after);
		expect(queue.getActual()).toEqual(piece_2);
		expect(queue.getNext()).toEqual(piece_3);

		queue.setPiece(piece_after);

		expect(queue.getPrev()).toEqual(piece_2);
		expect(queue.getActual()).toEqual(piece_3);
		expect(queue.getNext()).toEqual(piece_after);
		expect(queue.getActualRange()).toEqual({from, to});
	});
});
