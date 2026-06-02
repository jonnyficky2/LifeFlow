export function getToday(){

  return new Date()
    .toISOString()
    .split("T")[0];
}

export function getLocalDate(date){

  const offset =
    date.getTimezoneOffset();

  const local =
    new Date(
      date.getTime() - offset * 60000
    );

  return local
    .toISOString()
    .split("T")[0];
}

export function showToast(message){

  const toast =
    document.getElementById(
      "toast"
    );

  toast.innerText =
    message;

  toast.classList.add(
    "show"
  );

  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  },3000);
}

export function celebrate() {

  if (
    typeof confetti !==
    "undefined"
  ) {

    confetti({
      particleCount: 100,
      spread: 70
    });
  }
}

