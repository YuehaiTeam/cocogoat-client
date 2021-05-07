/*
 * Map Enhance Extension by Seelie(https://seelie.inmagi.com/)
 * Code extracted from: https://chrome.google.com/webstore/detail/seelie/jkapcfbicpbhigopkhpielmbkgfchdgh/related
 */
console.log('cocogoat: seelie plugin loaded')
/* eslint-disable */
/* css part */
const style = document.createElement('style')
style.innerHTML = `
@media only screen and (min-width: 900px) {
    .leaflet-draw {
        top: 80px;
    }
}
@media only screen and (max-width: 900px) {
    .leaflet-draw {
        position: fixed;
        bottom: 10px;
        right: 0;
    }
}

.leaflet-draw-toolbar a {
    filter: invert(1);
}

.leaflet-mouse-marker {
    opacity: 0 !important;
}

.layer-control__item.filtered,
.layer-control__group.filtered {
    display: none !important;
}

.seelie-filter {
    padding: 10px;
    width: 100%;
    border: none;
    background-color: #6c7b9a;
    color: white;
    font-size: 16px;
    margin-top: -10px;
    margin-bottom: 10px;
    border-radius: 6px;
}

.seelie-filter:focus {
    outline: none;
}

.seelie-filter::placeholder {
    color: white;
    opacity: .5;
}

.seelie-lang {
    position: absolute;
    right: 0;
    top: 0;
    margin-top: 25px;
    margin-right: 10px;
}

.seelie-features-button {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIVBMVEVHcEy+xNG/1dW+w9HMzN2/xNHMzP++w9G+xNC9xNC9w9DUJCVaAAAACnRSTlMAwwzID18F86mu31W9fQAAAGVJREFUKM9jYBhCgK19CoThWZEApllXLXYA0SxWqwKgAqtMQLTzKqgAmxRYCVDBQogWBkWwEqACIaipTCAlIAUKMHtASpAUQJQgKwArQVYAVoKiAKxECMX5TFKoChgYUsMGe5ADAFejIUYB5vq6AAAAAElFTkSuQmCC);
    height: 23px;
    width: 24px;
    border: none;
    background-position: center;
    background-color: transparent;
    background-size: contain;
    position: absolute;
    top: 25px;
    right: 20px;
    cursor: pointer;
    transition: all .3s;
    transform: rotate(180deg);
}

.seelie-features-button.open {
    transform: rotate(0);
}

.seelie-buttons {
    display: flex;
}

.seelie-buttons button {
    background: #24304a;
    border: none;
    color: white;
    padding: 6px 10px;
    font-weight: bold;
    font-size: 10px;
    cursor: pointer;
}

.seelie-buttons button:first-child {
    border-radius: 6px 0 0 6px;
}

.seelie-buttons button:not(:last-child) {
    border-right: 1px solid #3f4e6f;
}

.seelie-buttons button:last-child {
    border-radius: 0 6px 6px 0;
}

.seelie-buttons button:disabled {
    opacity: .6;
    pointer-events: none;
}

.map-popup__content {
    white-space: normal !important;
}

.map-popup__img {
    margin-top: 10px !important;
}

.seelie-features {
    padding: 14px 20px;
    background: #e2ded1;
    margin-bottom: 20px;
    margin-top: -10px;
    border-radius: 10px;
}

.seelie-features select {
    width: 100%;
    padding: 4px;
    background: rgba(255,255,255,.6);
    border: none;
    border-radius: 4px;
}

.features-buttons-1 {
    margin-bottom: 10px;
}

.features-buttons-2 {
    margin-top: 5px;
    justify-content: flex-end;
}

.seelie-features hr {
    margin: 10px 0;
    border-top: 1px solid whitesmoke;
    border-bottom: none;
}

.layer-control__copyright {
    background-image: none !important;
    line-height: unset !important;
    padding: 10px 20px !important;
}

.layer-control__copyright a {
    color: #941dc5;
    font-weight: bold;
}
`
document.head.appendChild(style)
/* english */
const langEn = {
    filter: 'Filter (Press "Esc" to reset)',
    new: 'New',
    rename: 'Rename',
    delete: 'Delete',
    import: 'Import',
    export: 'Export',
    backup: 'Backup',
    restore: 'Restore',
    nameExp: 'Name your preset',
    nameError: 'You already have a preset with this name.',
    nameErrorBlank: 'You need to type a name for your preset.',
    importExp: 'Paste previously exported preset code here',
    exportExp: 'Copy this code to share your preset with other users',
    backupExp: 'Copy the code bellow to save your backup. This includes all your presets and checked markers.',
    restoreExp: 'Paste your backup code below. All data will be replaced.',
    error: 'An error has occurred, if this was unintentional please contact seelie@inmagi.com',
}

/* js part */
let code
try {
    code = new URLSearchParams(window.location.search).get('lang')?.slice(0, 2)
} catch (error) {
    code = 'en'
}
let lang = langEn

let vue, main, map, markers, drawnItems, icon

let initInterval = setInterval(() => {
    vue = document.querySelector('#root')?.__vue__
    main = vue?.$children[0]
    map = main?.$children[0]?.$children[0]?.map || main?.$children[0]?.map
    markers = main?.$children[0]?.$children[0]?.markerList || main?.$children[0]?.markerList

    if (!vue || !main || !map || !markers || !markers.length) return

    initUI()
    initLeafletDraw()

    clearInterval(initInterval)
}, 500)

function initUI() {
    document.querySelector('.layer-control__copyright').innerHTML +=
        ' • cocogoat • Enhancement by <a href="https://seelie.inmagi.com/?ref=cocogoat" target="_blank">Seelie</a>'
    let features = document.createElement('div')
    features.classList.add('seelie-features')
    features.style.display = 'none'
    features.innerHTML = `
        <div class="seelie-buttons features-buttons-1">
            <button id="rename-button" disabled onclick="presetRename()">${lang.rename}</button>
            <button id="delete-button" disabled onclick="presetDelete()">${lang.delete}</button>
            <button id="export-button" disabled onclick="presetExport()">${lang.export}</button>
            <button id="new-button" onclick="presetNew()">${lang.new}</button>
            <button id="import-button" onclick="presetImport()">${lang.import}</button>
        </div>
        <select id="preset-select" onchange="onChangeSelectPreset()">
            <option></option>
        </select>
        <hr>
        <div class="seelie-buttons features-buttons-2">
            <button id="backup-button" onclick="dataBackup()">${lang.backup}</button>
            <button id="restore-button" onclick="dataRestore()">${lang.restore}</button>
        </div>
    `
    document.querySelector('.layer-control__header').appendChild(features)

    let select = document.querySelector('#preset-select')

    Object.keys(presets).forEach((name) => {
        select.innerHTML += `<option>${name}</option>`
    })

    let filter = document.createElement('input')
    filter.id = 'filter-input'
    filter.classList.add('seelie-filter')
    filter.placeholder = lang.filter
    document.querySelector('.layer-control__header').appendChild(filter)

    filter.onkeyup = (event) => {
        let key = filter.value?.toLowerCase()

        if (event.key == 'Escape') {
            filter.value = null
            key = null
        }

        document.querySelectorAll('.layer-control__item').forEach((item) => {
            let title = item.title?.toLowerCase()
            let group = item.parentElement?.parentElement?.children[0]?.textContent?.toLowerCase()

            if (!key || title.search(key) >= 0 || group.search(key) >= 0) item.classList.remove('filtered')
            else item.classList.add('filtered')
        })

        document.querySelectorAll('.layer-control__group').forEach((item) => {
            let count = item.querySelectorAll('.layer-control__item:not(.filtered)').length

            if (!count) item.classList.add('filtered')
            else item.classList.remove('filtered')
        })
    }

    let featuresOpener = document.createElement('button')
    featuresOpener.classList.add('seelie-features-button')
    featuresOpener.onclick = toggleFeatures
    document.querySelector('.layer-control__header').appendChild(featuresOpener)
}

function drawPreset(preset) {
    let data = preset.data || preset

    if (preset.markers && typeof preset.markers.includes == 'function') {
        document.querySelector('.btn-reset').click()
        Object.values(document.querySelectorAll('.layer-control__item'))
            .filter((n) => preset.markers.includes(n.__vue__?._uid))
            .forEach((node) => node.click())
    }

    try {
        L.geoJSON(data, {
            style: () => ({
                color: '#ffedd0',
            }),
            onEachFeature: function (f, l) {
                if (f.geometry.type == 'Point') {
                    drawnItems.addLayer(L.marker(l._latlng, { icon }))
                } else {
                    drawnItems.addLayer(l)
                }
            },
        })
    } catch (error) {}
}

function clearDrawn() {
    drawnItems.clearLayers()
    document.querySelector('.btn-reset').click()
}

let presets = JSON.parse(localStorage.getItem('presets')) || {}
let userMarkers = JSON.parse(localStorage.getItem('markers')) || {}

function getVisibleMarkers() {
    return Object.values(document.querySelectorAll('.layer-control__item.visible')).map((n) => n.__vue__?._uid)
}

function initLeafletDraw() {
    let selected = document.querySelector('#preset-select').value

    let leafletDrawCss = document.head.appendChild(document.createElement('link'))
    leafletDrawCss.rel = 'stylesheet'
    leafletDrawCss.href = 'https://cdn.jsdelivr.net/npm/leaflet-draw@1.0.4/dist/leaflet.draw.css'

    let leafletDraw = document.head.appendChild(document.createElement('script'))
    leafletDraw.src = 'https://cdn.jsdelivr.net/npm/leaflet-draw@1.0.4/dist/leaflet.draw.js'

    leafletDraw.onload = function () {
        icon = L.divIcon({
            // iconUrl: 'https://uploadstatic.mihoyo.com/hk4e/upload/officialsites/202011/wiki-ys-map-in-game-2_1605084458_8544.png',
            iconSize: [32, 42],
            iconAnchor: [16, 42],
            tooltipAnchor: [0, -42],
            popupAnchor: [0, -45],
            alt: '',
            className: 'mhy-game-gis-marker',
            html:
                '<div data-v-2c9139f8="" class="mhy-game-gis-icon" style="opacity: 1;"><div data-v-2c9139f8="" class="mhy-game-gis-icon__img" style="background-image: url(&quot;https://uploadstatic.mihoyo.com/ys-obc/2020/11/10/75276545/de87958fa1e78efcc84da49aad61dede_613786767338836681.jpg&quot;);"></div> <!----></div>',
        })

        drawnItems = new L.FeatureGroup()

        if (selected && presets[selected]) {
            drawPreset(presets[selected])
        } else {
            drawPreset(userMarkers)
        }

        if (code == 'pt') {
            L.drawLocal = {
                draw: {
                    toolbar: {
                        actions: {
                            title: 'Cancelar desenho',
                            text: 'Cancelar',
                        },
                        finish: {
                            title: 'Finalizar desenho',
                            text: 'Finalizar',
                        },
                        undo: {
                            title: 'Excluir o último ponto desenhado',
                            text: 'Excluir último',
                        },
                        buttons: {
                            polyline: 'Desenhar rota',
                            polygon: 'Desenhar polígono',
                            rectangle: 'Desenhar retângulo',
                            circle: 'Desenhar círculo',
                            marker: 'Adicionar marcador',
                            circlemarker: 'Desenhar marcador círculo',
                        },
                    },
                    handlers: {
                        circle: {
                            tooltip: {
                                start: 'Clique e arraste para desenhar um círculo.',
                            },
                            radius: 'Raio',
                        },
                        circlemarker: {
                            tooltip: {
                                start: 'Clique para adicionar um marcador círculo.',
                            },
                        },
                        marker: {
                            tooltip: {
                                start: 'Clique para adicionar um marcador.',
                            },
                        },
                        polygon: {
                            tooltip: {
                                start: 'Clique para começar a desenhar uma forma.',
                                cont: 'Clique para continuar a desenhar a forma.',
                                end: 'Clique no ponto inicial para terminar a forma.',
                            },
                        },
                        polyline: {
                            error: '<strong>Erro:</strong> beiradas da forma não podem se cruzar!',
                            tooltip: {
                                start: 'Clique para começar a desenhar a rota.',
                                cont: 'Clique para continuar desenhando a rota.',
                                end: 'Clique no último ponto para finalizar a rota.',
                            },
                        },
                        rectangle: {
                            tooltip: {
                                start: 'Clique e arraste para desenhar um retângulo.',
                            },
                        },
                        simpleshape: {
                            tooltip: {
                                end: 'Solte o mouse para finalizar o desenho.',
                            },
                        },
                    },
                },
                edit: {
                    toolbar: {
                        actions: {
                            save: {
                                title: 'Salvar alterações',
                                text: 'Salvar',
                            },
                            cancel: {
                                title: 'Cancelar edição, descartar mudanças',
                                text: 'Cancelar',
                            },
                            clearAll: {
                                title: 'Limpar todas as camadas',
                                text: 'Limpar Tudo',
                            },
                        },
                        buttons: {
                            edit: 'Editar camadas',
                            editDisabled: 'Sem camadas para editar',
                            remove: 'Excluir camadas',
                            removeDisabled: 'Sem camadas para excluir',
                        },
                    },
                    handlers: {
                        edit: {
                            tooltip: {
                                text: 'Arraste as alças ou marcadores para editar.',
                                subtext: 'Clique em cancelar para desfazer as alterações.',
                            },
                        },
                        remove: {
                            tooltip: {
                                text: 'Clique em algo para excluir.',
                            },
                        },
                    },
                },
            }
        }

        var drawControl = new L.Control.Draw({
            position: 'topright',
            edit: {
                featureGroup: drawnItems,
            },
            draw: {
                marker: { icon },
                circle: false,
                polyline: { shapeOptions: { color: '#ffedd0', opacity: 1 } },
                polygon: { shapeOptions: { color: '#ffedd0', opacity: 1 } },
                rectangle: { shapeOptions: { color: '#ffedd0', opacity: 1 } },
            },
        })

        map.addControl(drawControl)
        map.addLayer(drawnItems)

        map.on(L.Draw.Event.CREATED, function (e) {
            let type = e.layerType
            let layer = e.layer
            let selected = document.querySelector('#preset-select').value

            drawnItems.addLayer(layer)

            if (!selected) {
                userMarkers = drawnItems.toGeoJSON()
                localStorage.setItem('markers', JSON.stringify(userMarkers))
            } else {
                presets[selected] = {
                    data: drawnItems.toGeoJSON(),
                    markers: getVisibleMarkers(),
                }
                localStorage.setItem('presets', JSON.stringify(presets))
            }
        })

        map.on('draw:edited', function (e) {
            var layers = e.layers
            let selected = document.querySelector('#preset-select').value

            if (!selected) {
                userMarkers = drawnItems.toGeoJSON()
                localStorage.setItem('markers', JSON.stringify(userMarkers))
            } else {
                presets[selected] = {
                    data: drawnItems.toGeoJSON(),
                    markers: getVisibleMarkers(),
                }
                localStorage.setItem('presets', JSON.stringify(presets))
            }
        })

        map.on('draw:deleted', function (e) {
            var layers = e.layers
            let selected = document.querySelector('#preset-select').value

            if (!selected) {
                userMarkers = drawnItems.toGeoJSON()
                localStorage.setItem('markers', JSON.stringify(userMarkers))
            } else {
                presets[selected] = {
                    data: drawnItems.toGeoJSON(),
                    markers: getVisibleMarkers(),
                }
                localStorage.setItem('presets', JSON.stringify(presets))
            }
        })

        map.on('layeradd', updatePresetMarkers)
        map.on('layerremove', updatePresetMarkers)
    }
}

let presetMarkersTimeout
function updatePresetMarkers(event) {
    clearTimeout(presetMarkersTimeout)

    presetMarkersTimeout = setTimeout(function () {
        let selected = document.querySelector('#preset-select').value
        if (!selected || !presets[selected]) return

        let visibleMarkers = getVisibleMarkers()
        if (compare(presets[selected].markers, visibleMarkers)) return

        presets[selected] = {
            data: presets[selected].data,
            markers: visibleMarkers,
        }
        localStorage.setItem('presets', JSON.stringify(presets))
    }, 500)
}

function compare(a, b) {
    return JSON.stringify(a) == JSON.stringify(b)
}

function toggleFeatures() {
    let button = document.querySelector('.seelie-features-button')

    if (button.classList.contains('open')) {
        button.classList.remove('open')
        document.querySelector('.seelie-features').style.display = 'none'
    } else {
        button.classList.add('open')
        document.querySelector('.seelie-features').style.display = 'block'
    }
}

function onChangeSelectPreset() {
    let selected = document.querySelector('#preset-select').value

    clearDrawn()
    drawPreset(presets[selected] || userMarkers)

    if (!selected) {
        document.querySelector('#rename-button').disabled = true
        document.querySelector('#export-button').disabled = true
        document.querySelector('#delete-button').disabled = true
    } else {
        document.querySelector('#rename-button').disabled = false
        document.querySelector('#export-button').disabled = false
        document.querySelector('#delete-button').disabled = false
    }
}

function presetNew() {
    let select = document.querySelector('#preset-select')

    let name = prompt(lang.nameExp)

    if (Object.keys(presets).includes(name)) {
        return alert(lang.nameError)
    }

    if (!name) {
        return alert(lang.nameErrorBlank)
    }

    presets[name] = {
        data: new L.FeatureGroup().toGeoJSON(),
        markers: [],
    }

    localStorage.setItem('presets', JSON.stringify(presets))

    let newPreset = document.createElement('option')
    newPreset.textContent = name

    select.appendChild(newPreset)
    select.value = name

    clearDrawn()
    document.querySelector('#rename-button').disabled = false
    document.querySelector('#export-button').disabled = false
    document.querySelector('#delete-button').disabled = false
}

function presetRename() {
    let select = document.querySelector('#preset-select')

    let oldName = select.value
    let newName = prompt(lang.nameExp)

    if (Object.keys(presets).includes(newName)) {
        return alert(lang.nameError)
    }

    if (!newName) {
        return alert(lang.nameErrorBlank)
    }

    let i = Object.values(select.options).findIndex((o) => o.textContent == oldName)
    select.options[i].textContent = newName

    presets[newName] = presets[oldName]
    delete presets[oldName]

    localStorage.setItem('presets', JSON.stringify(presets))
}

function presetDelete() {
    let select = document.querySelector('#preset-select')
    let old = select.value
    select.value = ''

    let i = Object.values(select.options).findIndex((o) => o.textContent == old)
    if (i >= 0) select.options[i].remove()

    delete presets[old]
    localStorage.setItem('presets', JSON.stringify(presets))

    clearDrawn()
    drawPreset(userMarkers)

    document.querySelector('#rename-button').disabled = true
    document.querySelector('#export-button').disabled = true
    document.querySelector('#delete-button').disabled = true
}

function presetImport() {
    let data = prompt(lang.importExp)
    if (!data) return

    let name = prompt(lang.nameExp)

    if (!name) return alert(lang.nameErrorBlank)
    if (Object.keys(presets).includes(name)) {
        return alert(lang.nameError)
    }

    try {
        data = JSON.parse(data)

        let preset = {
            data: data.data,
            markers: data.markers,
        }

        presets[name] = preset

        let select = document.querySelector('#preset-select')
        select.innerHTML += `<option>${name}</option>`
        select.value = name

        clearDrawn()
        drawPreset(preset)

        localStorage.setItem('presets', JSON.stringify(presets))

        document.querySelector('#rename-button').disabled = false
        document.querySelector('#export-button').disabled = false
        document.querySelector('#delete-button').disabled = false
    } catch (error) {
        return alert(lang.error)
    }
}

function presetExport() {
    let select = document.querySelector('#preset-select')
    let preset = presets[select.value]

    prompt(lang.exportExp, JSON.stringify(preset))
}

function dataBackup() {
    let data = {
        presets: localStorage.getItem('presets'),
        markers: localStorage.getItem('markers'),
    }

    prompt(lang.backupExp, JSON.stringify(data))
}

function dataRestore() {
    let data = prompt(lang.restoreExp)
    if (!data) return

    try {
        data = JSON.parse(data)

        if (data.presets) {
            presets = JSON.parse(data.presets)
            localStorage.setItem('presets', data.presets)

            let select = document.querySelector('#preset-select')

            select.innerHTML = '<option></option>'

            Object.keys(presets).forEach((name) => {
                select.innerHTML += `<option>${name}</option>`
            })
        }

        if (data.markers) {
            userMarkers = JSON.parse(data.markers)
            localStorage.setItem('markers', data.markers)
        }

        document.querySelector('#preset-select').value = ''
        clearDrawn()
        drawPreset(userMarkers)

        document.querySelector('#rename-button').disabled = true
        document.querySelector('#export-button').disabled = true
        document.querySelector('#delete-button').disabled = true
    } catch (error) {
        return alert(lang.error)
    }
}
