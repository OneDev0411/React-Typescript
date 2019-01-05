export function getRegisterationScript({
  API_URL,
  LOCAL_STORAGE_REGISTERATION_KEY,
  openHouseId,
  openHouseTitle,
  agentAccessToken,
  agentUserId,
  brandId,
  onlineSubmitHandler,
  offlineSubmitHandler,
  storage
}) {
  return `
    <script>
      (() => {
        const API_URL = '${API_URL}';
        const LOCAL_STORAGE_REGISTERATION_KEY = '${LOCAL_STORAGE_REGISTERATION_KEY}';
        const storage = {
          getAll: ${storage.getAll},
          setAll: ${storage.setAll},
          get: ${storage.get},
          set: ${storage.set},
          remove: ${storage.remove},
          append: ${storage.append},
          get: ${storage.get}
        };
        const brandId = '${brandId}';

        const form = document.querySelector('form');        
        form.addEventListener('submit', e => {
          e.preventDefault();

          const first_name = document.querySelector('#firstname').value;
          const last_name = document.querySelector('#lastname').value;
          const email = document.querySelector('#email').value;
          const phone_number = document.querySelector('#phone').value;

          const openHouseData = {
            brandId,
            registration: {
              first_name,
              last_name,
              email,
              phone_number
            }
          };

          const data = {
            id: '${openHouseId}',
            title: '${openHouseTitle}',
            agentAccessToken: '${agentAccessToken}',
            agentUserId: '${agentUserId}',
            data: openHouseData
          }

          if (navigator.onLine) {
            (${onlineSubmitHandler})(data).then(() => {
              form.reset();
              toastr.success('The contact info has been successfully registered!');
            }).catch(err => {
              console.log(err);
            });
          } else {
            (${offlineSubmitHandler})(data);
          }
        });
      })();
    </script>
  `
}
