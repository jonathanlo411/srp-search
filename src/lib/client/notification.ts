
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export function setNotification(notificationText: string, isError: boolean): void {
  Toastify({
    text: notificationText,
    duration: 10000,
    close: true,
    gravity: "bottom", 
    position: "center",
    stopOnFocus: true,
    style: {
      background: (isError) ? '#FF0000' : 'var(--fastest)',
      boxShadow: '0 0 10px 0 var(--highlight)'
    },
    offset: {
      x: 0,
      y: '2em'
    }
  }).showToast();
}