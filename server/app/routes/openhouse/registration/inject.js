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
        function enableForm(formElement) {
          const elements = Array.from(formElement.elements);
          elements.forEach(item => item.removeAttribute('disabled'));
        }
        function disableForm(formElement) {
          const elements = Array.from(formElement.elements);
          elements.forEach(item => item.disabled = true);
        }

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
          disableForm(form);

          const first_name = document.querySelector('#firstname').value;
          const last_name = document.querySelector('#lastname').value;
          const email = document.querySelector('#email').value;
          const phone_number = document.querySelector('#phone').value.trim();
          
          let realtor_name = ''
          const realtorNameInput = document.querySelector('#realtor-name')
          if (realtorNameInput) {
            realtor_name = realtorNameInput.value.trim()
          }

          const openHouseData = {
            brandId,
            registration: {
              first_name,
              last_name,
              email,
              phone_number,
              realtor_name
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
              enableForm(form);
              form.reset();
              new Noty({
                theme: 'light',
                timeout: 3000,
                progressBar: false,
                type: 'success',
                text: 'The contact info has been successfully registered!',
              }).show();
            }).catch(err => {
              enableForm(form);
              console.log(err);
            });
          } else {
            (${offlineSubmitHandler})(data);
            enableForm(form);
            form.reset();
            new Noty({
              theme: 'light',
              timeout: 3000,
              progressBar: false,
              type: 'success',
              text: 'The contact info has been successfully registered!',
            }).show();
          }
        });
      })();
    </script>
  `
}
