import BoardsService from '../services/boardsService';
import ListsService from '../services/listsService';

const boardsService = new BoardsService();
const listsService = new ListsService();

export const FETCH_BOARD = '[BOARDS] FETCH BOARD';
export const MOVE_TASK = '[BOARD] MOVE TASK';
export const ADD_LIST = '[BOARD] ADD LIST';

export const fetchBoard = (boardId) => {
  return dispatch => boardsService.fetchBoard(boardId)
    .then(({data}) => {
      dispatch({
        type: FETCH_BOARD,
        payload: data
      });
    })
    .catch(e => console.log);
}

export const addList = (boardId, title) => {
  return dispatch => boardsService.createList(boardId, title)
    .then(({ data }) => {
      dispatch({
        type: ADD_LIST,
        payload: data
      });
    })
    .catch(e => console.log);
}

export const moveTask = (originListId, destinyListId, taskId) => {
  return (dispatch, getState) => {
    const { board } = getState();
    const previousListsState = board.lists;
    const task = board.lists
      .flatMap(list => list.tasks)
      .find(task => task.id == taskId);

    const updatedLists = board.lists.map(list => {
      if(list.id == destinyListId) {
        return {
          ...list,
          tasks: [...list.tasks, task]
        };
      } else if (list.id == originListId) {
        return {
          ...list,
          tasks: list.tasks.filter(task => task.id != taskId)
        }
      }

      return list;
    });

    dispatch({
      type: MOVE_TASK,
      payload: updatedLists,
    });

    listsService.updateTask(taskId, destinyListId)
      .then(resp => { })
      .catch(e => {
        dispatch({
          type: MOVE_TASK,
          payload: previousListsState,
        });
      });
  }
};