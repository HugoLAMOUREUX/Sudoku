package game.controllers;

import java.util.List;
import java.util.Map;

import game.services.NoGridStoredException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import game.models.MapModelDTO;
import game.models.NewScore;
import game.services.GridService;
import game.services.IdNotPresentException;

@RestController
@RequestMapping("game/grids")
public class GridController {
    private final GridService gridService;

    public GridController(final GridService gridservice) {
        this.gridService = gridservice;
    }

    @GetMapping(path = "allGrids", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<MapModelDTO> getAllGrids() {
        try {
            return gridService.readAllGrids("./src/main/java/game/data.json");
        } catch (NoGridStoredException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(path = "{id}/gridHighScore", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Integer> getGridHighScores(@PathVariable final int id) {
        try {
            return gridService.readHighScores(id, "./src/main/java/game/data.json");
        } catch (IdNotPresentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(path = "{id}/gridData", produces = MediaType.APPLICATION_JSON_VALUE)
    public MapModelDTO getGridData(@PathVariable final int id) {
        try {
            return gridService.readGridData(id, "./src/main/java/game/data.json");
        } catch (IdNotPresentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "score", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void setScore(@RequestBody final NewScore newScore) {
        if (newScore.getPlayer() == null || newScore.getValues() == null || newScore.getValues().length != 81
                || newScore.getScore() == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);

        }
        gridService.writeTextFile(newScore.getValues(), newScore.getPlayer(), newScore.getScore(),
                "./src/main/java/game/data.json");
    }

}
